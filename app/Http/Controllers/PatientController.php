<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\Patient;
use Exception;

class PatientController extends Controller {

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
}