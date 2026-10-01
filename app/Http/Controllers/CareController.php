<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\CareCategory;
use App\Models\Group;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CareController extends Controller {

  // Get all data in Care tree
  public function fetchCare() {
    try {
      $categories = CareCategory::with('problems.items')->get();

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
}
