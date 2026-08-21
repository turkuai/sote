<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class EntraIdAuthController extends Controller
{
    /**
     * Handle Microsoft Entra ID authentication via SimpleSAML
     * Matches the authentication flow from laatuhallinta/index.php
     */
    public function authenticate(Request $request)
    {
        try {
            require_once('../../../saml/src/_autoload.php');
            $as = new \SimpleSAML\Auth\Simple('sote');

            // If already authenticated, logout first to reset
            if ($as->isAuthenticated()) {
                $as->logout();
            }

            // Initiate authentication with Entra ID
            // SimpleSAML handles redirect and callback internally
            $as->requireAuth([
                'ReturnTo' => route('entra-id.process', absolute: true),
            ]);

            return $this->processAuthentication($as);
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'SimpleSAML configuration error: ' . $e->getMessage());
        }
    }

    /**
     * Process the Entra ID authentication response
     * Called after SimpleSAML redirects back with user attributes
     */
    public function processAuthentication($as = null)
    {
        if ($as === null) {
            try {
                require_once('../../../saml/src/_autoload.php');
                $as = new \SimpleSAML\Auth\Simple('sote');
            } catch (\Exception $e) {
                return redirect()->route('login')->with('error', 'SimpleSAML initialization failed');
            }
        }

        if (!$as->isAuthenticated()) {
            return redirect()->route('login')->with('error', 'Entra ID authentication failed');
        }

        // Extract attributes from Entra ID
        $attributes = $as->getAttributes();
        $email = $attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'][0] ?? null;
        $firstName = $attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'][0] ?? null;
        $lastName = $attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'][0] ?? null;

        // Cleanup SimpleSAML session
        $session = \SimpleSAML\Session::getSessionFromRequest();
        $session->cleanup();

        if (!$email) {
            return redirect()->route('login')->with('error', 'Email not found in Entra ID response');
        }

        // Check if user exists
        $user = User::where('email', $email)->first();

        if (!$user) {
            // Auto-register new user (Option 3: waiting approval)
            $user = User::create([
                'email' => $email,
                'first_name' => $firstName ?? '',
                'last_name' => $lastName ?? '',
                'name' => trim(($firstName ?? '') . ' ' . ($lastName ?? '')) ?: $email,
                'password' => bcrypt(Str::random(32)), // Random password since they auth via Entra ID
                'role_type' => null, // No role until admin approves
            ]);
        } else {
            // Update user info if fields are empty
            $updates = [];
            if (empty($user->first_name) && $firstName) {
                $updates['first_name'] = $firstName;
            }
            if (empty($user->last_name) && $lastName) {
                $updates['last_name'] = $lastName;
            }
            if (!empty($updates)) {
                $user->update($updates);
            }
        }

        // Log in the user
        Auth::login($user, remember: false);

        // Redirect based on user role
        if ($user->role_type) {
            return redirect()->intended(route('dashboard', absolute: false));
        } else {
            return redirect()->route('waiting-approval');
        }
    }
}
