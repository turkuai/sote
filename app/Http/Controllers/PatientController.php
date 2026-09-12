<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class PatientController extends Controller
{
  //Get all the patients
  public function index(Request $request)
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
      $query = Patient::query();
      if($request->has("search") && $request->search) {
        $search = strtolower($request->search);
        $query->where(function ($whereQuery) use ($search) {
          $whereQuery->whereRaw("LOWER(first_name) LIKE ?", ["%{$search}%"])
           ->orWhereRaw('LOWER(last_name) LIKE ?', ["%{$search}%"]);
        });
      }
      $patientsPaginator = $query->paginate($pageSize);

      return ApiResponse::paginated(
        $patientsPaginator,
        "All patients have been retrieved."
      );
    } catch (\Throwable $e) {
      return ApiResponse::error(
        $e->getMessage(),
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

  public function store(Request $request) {
    $validator = Validator::make($request->all(),[
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'social_id' => 'required|string',
        'arrival_date' => 'required|date',
        'remarks' => 'nullable|string',
    ]);

    if ($validator->fails()) {
      return ApiResponse::validationError($validator->errors());
    }

    $data = $validator->validated();

    $patient = Patient::create($data);

    return ApiResponse::success($patient, 'Patient created successfully', 201);
  }

  public function update(Request $request, $id) {

    $patient = Patient::find($id);

    if(!$patient) {
      return ApiResponse::notFound('Patient not found');
    }

    $validator = Validator::make($request->all(),[
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'social_id' => 'required|string',
        'arrival_date' => 'required|date',
        'remarks' => 'nullable|string',
    ]);

    if ($validator->fails()) {
      return ApiResponse::validationError($validator->errors());
    }

    $data = $validator->validated();

    $patient->update($data);

    $patient->refresh();

    return ApiResponse::success($patient, 'Patient created successfully');
  }

  public function destroy($id) {
    $patient = Patient::find($id);

    if(!$patient) {
      return ApiResponse::notFound("Patient not found");
    }

    $patient->delete();

    return ApiResponse::success($patient, "Patient deleted succesfully");
  }
}
