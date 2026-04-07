<?php

namespace App\Libraries;

/**
 * Utility Helper Functions Library
 * Common utility functions used across the application
 */

class Helper
{
    /**
     * Generate a slug from a string
     */
    public static function slug($string)
    {
        return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $string), '-'));
    }

    /**
     * Generate a unique slug
     */
    public static function uniqueSlug($string, $model, $table)
    {
        $slug = self::slug($string);
        $count = 1;
        $originalSlug = $slug;

        while ($model::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    /**
     * Format bytes to human-readable size
     */
    public static function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    /**
     * Generate a random string
     */
    public static function randomString($length = 32)
    {
        return substr(str_shuffle(str_repeat($x = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', ceil($length / strlen($x)))), 1, $length);
    }

    /**
     * Check if string is JSON
     */
    public static function isJson($string)
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    /**
     * Truncate string with ellipsis
     */
    public static function truncate($string, $length = 100, $ellipsis = '...')
    {
        if (strlen($string) <= $length) {
            return $string;
        }
        return substr($string, 0, $length) . $ellipsis;
    }

    /**
     * Convert array to csv string
     */
    public static function arrayToCsv($array)
    {
        $df = fopen('php://memory', 'w');
        fputcsv($df, $array);
        rewind($df);
        $csv = fgets($df);
        fclose($df);
        return trim($csv);
    }

    /**
     * Convert CSV string to array
     */
    public static function csvToArray($string)
    {
        $df = fopen('php://memory', 'r+');
        fputs($df, $string);
        rewind($df);
        $array = fgetcsv($df);
        fclose($df);
        return $array;
    }

    /**
     * Get current timestamp in database format
     */
    public static function now()
    {
        return now()->format('Y-m-d H:i:s');
    }

    /**
     * Format date for display
     */
    public static function formatDate($date, $format = 'd/m/Y')
    {
        return \Carbon\Carbon::parse($date)->format($format);
    }

    /**
     * Get time difference in human-readable format
     */
    public static function timeDiff($date)
    {
        return \Carbon\Carbon::parse($date)->diffForHumans();
    }
}
