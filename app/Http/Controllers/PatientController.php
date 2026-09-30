<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\Patient;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller {
  // Get all the patients
  public function index() {
    /*
      * Match the number of items displayed per page in ServerGrid.
      * This value must stay synchronized with ServerGrid's pageSize. Otherwise,
      * the frontend pagination may not match the number of records returned by the backend.
      * In the future, we should consider passing pageSize from the frontend as a query
      * parameter. This would require modifying the tai-grid package directly.
      * ServerGrid already sends the current page as "?page=...", which Laravel's
      * paginate() automatically recognizes and uses to retrieve the correct page.
    */
    $pageSize = 10;

    try {
      $patients = Patient::paginate($pageSize);

      return ApiResponse::paginated(
        $patients,
        'All patients have been retrieved.'
      );
    } catch (Exception $e) {
      return ApiResponse::error(
        "Error: Patients could not be retrieved. Error: {$e->getMessage()}",
        500,
      );
    }
  }

  // Get specific patient via id
  public function show($id) {
    $patient = Patient::find($id);

    if (! $patient) {
      return ApiResponse::error('Patient not found');
    }

    return ApiResponse::success($patient, 'Patients Retrieved succesfully');
  }

  // Update a patient
  public function update(Request $request, $id) {
    $patient = Patient::find($id);

    if (! $patient) {
      return ApiResponse::notFound('Patient not found');
    }

    $validator = Validator::make($request->all(), [
      'first_name' => 'sometimes|required|string|max:255',
      'last_name' => 'sometimes|required|string|max:255',
      'social_id' => 'sometimes|required|string|size:11',
      'arrival_date' => 'sometimes|nullable|date',
      'remarks' => 'sometimes|nullable|string',
    ]);

    if ($validator->fails()) {
      return ApiResponse::validationError($validator->errors());
    }

    $patient->update($validator->validated());
    $patient->refresh();

    return ApiResponse::success($patient, 'Patient updated successfully');
  }

  //Create a new patient
  public function store(Request $request) {
    $validator = Validator::make($request->all(), [
      'first_name' => 'required|string|max:255',
      'last_name' => 'required|string|max:255',
      'social_id' => 'required|string|max:255|unique:patients,social_id',
      'remarks' => ''
    ]);

    if ($validator->fails()) {
      return ApiResponse::validationError($validator->errors());
    }

    $patient = Patient::create($validator->validated());

    return ApiResponse::success($patient, 'Patient created successfully', 201);
  }

  // GET groups assigned to a patient
  public function getGroups(Request $request, $id) {
    $patient = Patient::find($id);

    if (!$patient) {
      return ApiResponse::error("Patient not found", 404);
    }

    $groups = $patient->patient_groups;

    return ApiResponse::success($groups, "Patient groups retrieved successfully");
  }

  // GET patients that belong to any group the given user is a member of
  public function getUserPatients(Request $request) {
    // Default to the authenticated user when no user_id is supplied
    $userId = $request->query('user_id', Auth::id());

    $validator = Validator::make(
      ['user_id' => $userId],
      ['user_id' => 'required|integer|exists:users,id']
    );

    if ($validator->fails()) {
      return ApiResponse::validationError($validator->errors());
    }

    try {
      /*
       * Match ServerGrid's pageSize (see index() for why).
       * ServerGrid sends ?page=N which paginate() picks up automatically.
       */
      $pageSize = 10;
      $patients = Patient::forUser(Auth::id())->paginate($pageSize);

      return ApiResponse::paginated($patients, 'User patients retrieved successfully');
    } catch (Exception $e) {
      return ApiResponse::error(
        "Error: User patients could not be retrieved. Error: {$e->getMessage()}",
        500
      );
    }
  }
}
