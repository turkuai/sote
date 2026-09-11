<?php

namespace App\Libraries;

class Permission {
  // Permission bits
  const CREATE = 1;     // 0001
  const READ = 2;       // 0010
  const UPDATE = 4;     // 0100
  const DELETE = 8;     // 1000
  const ADMIN = 16;     // 10000
  const EXPORT = 32;    // 100000
  const IMPORT = 64;    // 1000000
  const APPROVE = 128;  // 10000000

  /**
   * Check if a permission is granted
   *
   * @param int $permissions
   * @param int $permission
   * @return bool
   */
  public static function has($permissions, $permission) {
    return ($permissions & $permission) === $permission;
  }

  /**
   * Grant a permission
   *
   * @param int $permissions
   * @param int $permission
   * @return int
   */
  public static function grant($permissions, $permission) {
    return $permissions | $permission;
  }

  /**
   * Revoke a permission
   *
   * @param int $permissions
   * @param int $permission
   * @return int
   */
  public static function revoke($permissions, $permission) {
    return $permissions & ~$permission;
  }

  /**
   * Get all permissions
   *
   * @return array
   */
  public static function all() {
    return [
      'CREATE' => self::CREATE,
      'READ' => self::READ,
      'UPDATE' => self::UPDATE,
      'DELETE' => self::DELETE,
      'ADMIN' => self::ADMIN,
      'EXPORT' => self::EXPORT,
      'IMPORT' => self::IMPORT,
      'APPROVE' => self::APPROVE,
    ];
  }

  /**
   * Get permission names for a value
   *
   * @param int $permissions
   * @return array
   */
  public static function getPermissions($permissions) {
    $result = [];

    if (self::has($permissions, self::CREATE)) {
      $result[] = 'CREATE';
    }
    if (self::has($permissions, self::READ)) {
      $result[] = 'READ';
    }
    if (self::has($permissions, self::UPDATE)) {
      $result[] = 'UPDATE';
    }
    if (self::has($permissions, self::DELETE)) {
      $result[] = 'DELETE';
    }
    if (self::has($permissions, self::ADMIN)) {
      $result[] = 'ADMIN';
    }
    if (self::has($permissions, self::EXPORT)) {
      $result[] = 'EXPORT';
    }
    if (self::has($permissions, self::IMPORT)) {
      $result[] = 'IMPORT';
    }
    if (self::has($permissions, self::APPROVE)) {
      $result[] = 'APPROVE';
    }

    return $result;
  }
}
