<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\Patient;
use Exception;

class PatientController extends Controller
{
  //Get all the patients
  public function index()
  {
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
  public function show($id)
  {
    $patient = Patient::find($id);

    if (!$patient) {
      return ApiResponse::error("Patient not found");
    }

    return ApiResponse::success($patient, "Patients Retrieved succesfully");
  }
}
