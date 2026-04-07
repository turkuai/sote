<?php

namespace App\Libraries;

/**
 * Base Validation Rules Library
 * Common validation rules used across the application
 */

class ValidationRules
{
    /**
     * Get email validation rule
     */
    public static function email()
    {
        return 'email';
    }

    /**
     * Get email with unique rule
     */
    public static function uniqueEmail($table = 'users', $column = 'email', $ignoreId = null)
    {
        $rule = "unique:$table,$column";
        if ($ignoreId) {
            $rule .= ",$ignoreId";
        }
        return $rule;
    }

    /**
     * Get required rule
     */
    public static function required()
    {
        return 'required';
    }

    /**
     * Get string rule with max length
     */
    public static function string($max = 255)
    {
        return "string|max:$max";
    }

    /**
     * Get name rules (required, string, max 255)
     */
    public static function name()
    {
        return 'required|string|max:255';
    }

    /**
     * Get password rules (required, min 8, confirmed)
     */
    public static function password()
    {
        return 'required|min:8|confirmed';
    }

    /**
     * Get slug rules (required, string, unique)
     */
    public static function slug($table = 'pages', $ignoreId = null)
    {
        $rule = "required|string|unique:$table";
        if ($ignoreId) {
            $rule .= ",$ignoreId";
        }
        return $rule;
    }

    /**
     * Get URL rules
     */
    public static function url()
    {
        return 'url';
    }

    /**
     * Get phone rules (basic)
     */
    public static function phone()
    {
        return 'regex:/^[\d\s\-\+\(\)]{10,}$/';
    }

    /**
     * Get numeric rules
     */
    public static function numeric($min = null, $max = null)
    {
        $rule = 'numeric';
        if ($min !== null) {
            $rule .= "|min:$min";
        }
        if ($max !== null) {
            $rule .= "|max:$max";
        }
        return $rule;
    }

    /**
     * Get date rules
     */
    public static function date()
    {
        return 'date';
    }

    /**
     * Get array rules
     */
    public static function array($minItems = null)
    {
        $rule = 'array';
        if ($minItems !== null) {
            $rule .= "|min:$minItems";
        }
        return $rule;
    }
}
