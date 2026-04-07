<?php

namespace App\Libraries;

use Illuminate\Database\Eloquent\Model;

/**
 * Base Repository Class for Database Operations
 * Provides common CRUD operations and query building
 */

abstract class BaseRepository
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get all records
     */
    public function all($columns = ['*'])
    {
        return $this->model->select($columns)->get();
    }

    /**
     * Get paginated records
     */
    public function paginate($perPage = 15, $columns = ['*'])
    {
        return $this->model->select($columns)->paginate($perPage);
    }

    /**
     * Get record by ID
     */
    public function find($id, $columns = ['*'])
    {
        return $this->model->select($columns)->find($id);
    }

    /**
     * Create a new record
     */
    public function create($data)
    {
        return $this->model->create($data);
    }

    /**
     * Update a record
     */
    public function update($id, $data)
    {
        $record = $this->find($id);
        if ($record) {
            $record->update($data);
            return $record;
        }
        return null;
    }

    /**
     * Delete a record
     */
    public function delete($id)
    {
        $record = $this->find($id);
        if ($record) {
            $record->delete();
            return true;
        }
        return false;
    }

    /**
     * Find by multiple conditions
     */
    public function findBy($attribute, $value, $columns = ['*'])
    {
        return $this->model->where($attribute, $value)->select($columns)->first();
    }

    /**
     * Get multiple records by conditions
     */
    public function getWhere($conditions, $columns = ['*'])
    {
        $query = $this->model->select($columns);
        foreach ($conditions as $key => $value) {
            $query->where($key, $value);
        }
        return $query->get();
    }

    /**
     * Count records
     */
    public function count($conditions = [])
    {
        $query = $this->model;
        foreach ($conditions as $key => $value) {
            $query = $query->where($key, $value);
        }
        return $query->count();
    }

    /**
     * Check if record exists
     */
    public function exists($conditions)
    {
        $query = $this->model;
        foreach ($conditions as $key => $value) {
            $query = $query->where($key, $value);
        }
        return $query->exists();
    }
}
