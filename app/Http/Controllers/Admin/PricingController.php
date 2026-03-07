<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingPackage;
use App\Models\MonitoringPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingController extends Controller
{
    public function index()
    {
        $packages = PricingPackage::orderBy('sort_order')->get();

        return Inertia::render('admin/pricing/index', [
            'packages' => $packages,
        ]);
    }

    public function edit($id)
    {
        $package = PricingPackage::findOrFail($id);

        return Inertia::render('admin/pricing/edit', [
            'package' => $package,
        ]);
    }

    public function update(Request $request, $id)
    {
        $package = PricingPackage::findOrFail($id);

        $validated = $request->validate([
            'name'         => 'required|string|max:100',
            'price_label'  => 'nullable|string|max:50',
            'price'        => 'required|numeric|min:0',
            'color'        => 'required|string|max:50',
            'border_color' => 'nullable|string|max:100',
            'button_color' => 'nullable|string|max:100',
            'is_popular'   => 'boolean',
            'sort_order'   => 'integer|min:0',
            'button_text'  => 'required|string|max:100',
            'is_active'    => 'boolean',
            'max_devices'  => 'integer|min:1',
            'max_sensors'  => 'integer|min:1',
            'features'     => 'required|array',
            'features.*.label'    => 'required|string',
            'features.*.included' => 'required|boolean',
        ]);

        $package->update($validated);

        // Sync with MonitoringPackage so that MemberAreaController and Subscriptions keep working
        MonitoringPackage::updateOrCreate(
            ['id' => $package->id],
            [
                'name' => $validated['name'],
                'base_price' => $validated['price'],
                'max_sensors' => $validated['max_sensors'] ?? 5,
                'is_active' => $validated['is_active'] ?? true,
            ]
        );

        return redirect()->route('admin.pricing.index')
            ->with('success', 'Paket berhasil diperbarui!');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:100',
            'slug'         => 'required|string|max:100|unique:pricing_packages,slug',
            'price'        => 'required|numeric|min:0',
            'price_label'  => 'nullable|string|max:50',
            'color'        => 'required|string|max:50',
            'border_color' => 'nullable|string|max:100',
            'button_color' => 'nullable|string|max:100',
            'is_popular'   => 'boolean',
            'sort_order'   => 'integer|min:0',
            'button_text'  => 'required|string|max:100',
            'is_active'    => 'boolean',
            'max_devices'  => 'integer|min:1',
            'max_sensors'  => 'integer|min:1',
            'features'     => 'required|array',
            'features.*.label'    => 'required|string',
            'features.*.included' => 'required|boolean',
        ]);

        $pricingPackage = PricingPackage::create($validated);

        // Sync with MonitoringPackage
        MonitoringPackage::updateOrCreate(
            ['id' => $pricingPackage->id],
            [
                'name' => $validated['name'],
                'base_price' => $validated['price'],
                'max_sensors' => $validated['max_sensors'] ?? 5,
                'is_active' => $validated['is_active'] ?? true,
            ]
        );

        return redirect()->route('admin.pricing.index')
            ->with('success', 'Paket baru berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $package = PricingPackage::findOrFail($id);
        $package->delete();

        return redirect()->route('admin.pricing.index')
            ->with('success', 'Paket berhasil dihapus!');
    }

    public function create()
    {
        return Inertia::render('admin/pricing/create');
    }

    public function toggleActive(Request $request, $id)
    {
        $package = PricingPackage::findOrFail($id);
        $package->update(['is_active' => !$package->is_active]);

        return redirect()->route('admin.pricing.index')
            ->with('success', $package->is_active ? 'Paket diaktifkan.' : 'Paket dinonaktifkan.');
    }
}
