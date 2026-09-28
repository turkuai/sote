<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\Patient;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller {
  //Get all the patients
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
        "All patients have been retrieved."
      );
    } catch (Exception $e) {
      return ApiResponse::error(
        "Error: Patients could not be retrieved. Error: {$e->getMessage()}",
        500,
      );
    }
  }

  //Get specific patient via id
  public function show($id) {
    $patient = Patient::find($id);

    if (!$patient) {
      return ApiResponse::error("Patient not found");
    }

    return ApiResponse::success($patient, "Patients Retrieved succesfully");
  }

  //Create a new patient
  public function store(Request $request) {
    $validator = Validator::make($request->all(), [
      'first_name' => 'required|string|max:255',
      'last_name' => 'required|string|max:255',
      'social_id' => 'required|string|max:255|unique:patients,social_id'
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

  // Assign a group to a patient
  public function addGroupToPatient(Request $request, $patientId, $groupId) {
    $patient = Patient::find($patientId);

    if (!$patient) {
      return ApiResponse::error("Patient not found", 404);
    }

    $validator = Validator::make($request->all(), [
      'group_id' => 'required|exists:groups,id',
    ]);

    if ($validator->fails()) {
      return ApiResponse::validationError($validator->errors());
    }

    $groupId = $request->input('group_id');

    // Check if the group is already assigned to the patient
    if ($patient->patient_groups()->where('group_id', $groupId)->exists()) {
      return ApiResponse::error("Group is already assigned to the patient", 400);
    }

    // Assign the group to the patient
    $patient->patient_groups()->attach($groupId);

    return ApiResponse::success(null, "Group assigned to patient successfully");
  }
}
