<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function index()
    {
        $sections = LandingPage::all();
        
        return Inertia::render('admin/landing-page/index', [
            'sections' => $sections,
        ]);
    }

    public function edit($id)
    {
        $section = LandingPage::findOrFail($id);
        
        return Inertia::render('admin/landing-page/edit', [
            'section' => $section,
        ]);
    }

    public function update(Request $request, $id)
    {
        $section = LandingPage::findOrFail($id);
        
        $validated = $request->validate([
            'content' => 'required|array',
            'is_active' => 'boolean',
        ]);

        $section->update($validated);

        return redirect()->route('admin.landing-page.index')
            ->with('success', 'Landing page section updated successfully');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('landing-pages', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }
}
