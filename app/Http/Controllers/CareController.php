<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\CareCategory;
use App\Models\CareProblem;
use App\Models\CareProblemItems;
use App\Models\Group;
use App\Models\Patient;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CareController extends Controller {

  // Get all data in Care tree
  public function fetchCareCategories() {
    try {
      // Eager-load each category's problems (with their items) so toArray() includes them.
      $categories = CareCategory::get();

      // Index every category by id, seeding an empty "children" array.
      $nodes = [];
      foreach ($categories as $category) {
        $node = $category->toArray();     // includes eager-loaded "problems" (each with "items")
        $node['children'] = [];
        $nodes[$category->id] = $node;
      }

      // Nest by parent_category_id; null parent => top-level (main category).
      $tree = [];
      foreach ($categories as $category) {
        if ($category->parent_category_id === null) {
          $tree[] = &$nodes[$category->id];
        } else {
          $nodes[$category->parent_category_id]['children'][] = &$nodes[$category->id];
        }
      }
      unset($category);

      return ApiResponse::success($tree, 'Care tree retrieved successfully');
    } catch (Exception $e) {
      return ApiResponse::error(
        "Error: Care tree could not be retrieved. Error: {$e->getMessage()}",
        500
      );
    }
  }

  // Get all care problems recorded for a specific patient
  public function fetchPatientProblems($patientId) {
    try {
      $patient = Patient::find($patientId);

      if (!$patient) {
        return ApiResponse::notFound('Patient not found');
      }

      $problems = CareProblem::where('patient_id', $patient->id)
        ->with(['items', 'author:id,first_name,last_name'])
        ->get();

      return ApiResponse::success($problems, 'Patient care problems retrieved successfully');
    } catch (Exception $e) {
      return ApiResponse::error(
        "Error: Patient care problems could not be retrieved. Error: {$e->getMessage()}",
        500
      );
    }
  }

  // Add a new care problem for a patient
  public function addProblem(Request $request) {
    try {
      $validator = Validator::make($request->all(), [
        'patient_id' => 'required|integer|exists:patients,id',
        'category_id' => 'required|integer|exists:care_categories,id',
        'description' => 'required|string|max:1000',
      ]);

      if ($validator->fails()) {
        return ApiResponse::validationError($validator->errors());
      }

      $validated = $validator->validated();

      $problem = CareProblem::create([
        'category_id' => $validated['category_id'],
        'author_id' => Auth::id(),
        'patient_id' => $validated['patient_id'],
        'description' => $validated['description'],
      ]);

      return ApiResponse::success(
        $problem->load('author:id,first_name,last_name'),
        'Care problem added successfully',
        201
      );
    } catch (Exception $e) {
      return ApiResponse::error(
        "Error: Care problem could not be added. Error: {$e->getMessage()}",
        500
      );
    }
  }

  // Add a goal (0), activity (1) or review (2) item to a care problem
  public function addProblemItem(Request $request) {
    try {
      $validator = Validator::make($request->all(), [
        'problem_id' => 'required|integer|exists:care_problems,id',
        'description' => 'required|string|max:1000',
        'type' => 'required|in:0,1,2,goal,activity,review',
      ]);

      if ($validator->fails()) {
        return ApiResponse::validationError($validator->errors());
      }

      $validated = $validator->validated();

      $typeMap = [
        0 => 'goal',
        1 => 'activity',
        2 => 'review',
        'goal' => 'goal',
        'activity' => 'activity',
        'review' => 'review',
      ];
      $type = $typeMap[$validated['type']];

      $item = CareProblemItems::create([
        'problem_id' => $validated['problem_id'],
        'description' => $validated['description'],
        'author_id' => Auth::id(),
        'type' => $type,
      ]);

      return ApiResponse::success(
        $item->load('problem'),
        'Care problem item added successfully',
        201
      );
    } catch (Exception $e) {
      return ApiResponse::error(
        "Error: Care problem item could not be added. Error: {$e->getMessage()}",
        500
      );
    }
  }

  // Update a care problem's description (admin/manager only)
  public function updateProblem(Request $request, $id) {
    try {
      $problem = CareProblem::find($id);

      if (!$problem) {
        return ApiResponse::notFound('Care problem not found');
      }

      $validator = Validator::make($request->all(), [
        'description' => 'required|string|max:1000',
      ]);

      if ($validator->fails()) {
        return ApiResponse::validationError($validator->errors());
      }

      $validated = $validator->validated();

      $problem->update([
        'description' => $validated['description'],
      ]);

      return ApiResponse::success(
        $problem->load(+'author:id,first_name,last_name'),
        'Care problem updated successfully',
        200
      );
    } catch (Exception $e) {
      return ApiResponse::error(
        "Error: Care problem could not be updated. Error: {$e->getMessage()}",
        500
      );
    }
  }

  // Update own goal/activity/review item (owner only)
  public function updateProblemItem(Request $request, $id) {
    try {
      $item = CareProblemItems::find($id);

      if (!$item) {
        return ApiResponse::notFound('Care problem item not found');
      }

      if ($item->author_id !== Auth::id()) {
        return ApiResponse::error('Forbidden: You can only edit your own items', 403);
      }

      $validator = Validator::make($request->all(), [
        'description' => 'sometimes|required|string|max:1000',
      ]);

      if ($validator->fails()) {
        return ApiResponse::validationError($validator->errors());
      }

      $validated = $validator->validated();

      $updateData = [];
      if (isset($validated['description'])) {
        $updateData['description'] = $validated['description'];
      }

      $item->update($updateData);

      return ApiResponse::success(
        $item->load('problem'),
        'Care problem item updated successfully',
        200
      );
    } catch (Exception $e) {
      return ApiResponse::error(
        "Error: Care problem item could not be updated. Error: {$e->getMessage()}",
        500
      );
    }
  }
}
