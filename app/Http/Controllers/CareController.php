<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\CareCategory;
use App\Models\CareProblem;
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

      if (! $patient) {
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
}
