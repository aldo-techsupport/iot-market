<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPage;
use App\Models\MemberAreaSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberAreaEditorController extends Controller
{
    public function editor()
    {
        $settings = MemberAreaSetting::getSetting();

        return Inertia::render('admin/member-area-editor', [
            'settings' => $settings,
        ]);
    }

    public function saveSettings(Request $request)
    {
        $validated = $request->validate([
            'hero_badge_text'   => 'nullable|string|max:255',
            'hero_title'        => 'nullable|string|max:500',
            'hero_subtitle'     => 'nullable|string|max:1000',
            'hero_cta_text'     => 'nullable|string|max:100',
            'features_title'    => 'nullable|string|max:255',
            'features_subtitle' => 'nullable|string|max:500',
            'feature_1_title'   => 'nullable|string|max:255',
            'feature_1_desc'    => 'nullable|string|max:500',
            'feature_2_title'   => 'nullable|string|max:255',
            'feature_2_desc'    => 'nullable|string|max:500',
            'feature_3_title'   => 'nullable|string|max:255',
            'feature_3_desc'    => 'nullable|string|max:500',
            'pricing_title'     => 'nullable|string|max:255',
            'pricing_subtitle'  => 'nullable|string|max:500',
            'cta_title'         => 'nullable|string|max:255',
            'cta_subtitle'      => 'nullable|string|max:500',
            'cta_button_text'   => 'nullable|string|max:100',
            'footer_text'       => 'nullable|string|max:500',
            'show_features'     => 'nullable|boolean',
            'show_cta'          => 'nullable|boolean',
        ]);

        $settings = MemberAreaSetting::getSetting();
        $settings->update($validated);

        return redirect()->back()->with('success', 'Member area settings saved successfully.');
    }

    /**
     * Visual editor for landing page (all sections in one split view).
     */
    public function landingEditor()
    {
        $sections = LandingPage::all();

        return Inertia::render('admin/landing-page/visual-editor', [
            'sections' => $sections,
        ]);
    }
}
