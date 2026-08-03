<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\Patient;
use Exception;

class PatientController extends Controller {

    //Get all the patients
    public function index() {
       try {
        $patients = Patient::all();

        return ApiResponse::success(
            $patients,
            "All patients have been retrieved."
        );
       }catch(Exception $e) {
        return ApiResponse::error(
                "Error: Patients could not be retrieved.",
                500,
            );
       }
    }

    //Get specific patient via id
    public function show($id) {
        $patient = Patient::find($id);

        if(!$patient) {
            return ApiResponse::error("Patient not found");
        }

        return ApiResponse::success($patient, "Patients Retrieved succesfully");
    }
}