import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface Sensor {
    id: number;
    name: string;
    code: string;
    description: string;
    unit: string;
    icon: string;
}

interface MonitoringPackage {
    id: number;
    name: string;
    description: string;
    base_price: number;
    max_sensors: number;
}

interface SensorConfig {
    sensor_id: number;
    variable_name: string;
    custom_name: string;
    unit: string;
}

interface Props {
    order: {
        id: number;
        order_number: string;
        status: string;
    };
    package: MonitoringPackage;
    sensors: Sensor[];
    availableVariables: string[];
}

export default function DeviceSetup({ order, package: pkg, sensors, availableVariables = [] }: Props) {
    const [sensorConfigs, setSensorConfigs] = useState<SensorConfig[]>([]);
    
    const { data, setData, post, processing, errors } = useForm({
        order_id: order.id,
        device_name: '',
        device_location: '',
        device_description: '',
        sensors: [] as SensorConfig[],
    });

    const sanitizeInput = (value: string): string => {
        return value.replace(/[^\p{L}\p{N}\s\-_.,()%°³²/]/gu, '');
    };

    const addSensor = () => {
        if (sensorConfigs.length >= pkg.max_sensors) {
            alert(`Paket ${pkg.name} maksimal ${pkg.max_sensors} sensor!`);
            return;
        }

        const usedVariables = sensorConfigs.map(c => c.variable_name);
        const nextVariable = availableVariables.find(v => !usedVariables.includes(v));
        
        if (!nextVariable) {
            alert(`Maksimal ${pkg.max_sensors} sensor`);
            return;
        }

        const newConfig: SensorConfig = {
            sensor_id: 0,
            variable_name: nextVariable,
            custom_name: '',
            unit: '',
        };
        
        const updated = [...sensorConfigs, newConfig];
        setSensorConfigs(updated);
        setData('sensors', updated);
    };

    const removeSensor = (index: number) => {
        const updated = sensorConfigs.filter((_, i) => i !== index);
        setSensorConfigs(updated);
        setData('sensors', updated);
    };

    const updateSensorConfig = (index: number, field: keyof SensorConfig, value: any) => {
        const updated = [...sensorConfigs];
        updated[index] = { ...updated[index], [field]: value };
        
        if (field === 'sensor_id' && value > 0) {
            const sensor = sensors.find(s => s.id === value);
            if (sensor) {
                updated[index].custom_name = sensor.name;
                updated[index].unit = sensor.unit;
            }
        }
        
        setSensorConfigs(updated);
        setData('sensors', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (sensorConfigs.length === 0) {
            alert('Tambahkan minimal 1 sensor!');
            return;
        }

        const incomplete = sensorConfigs.some(c => !c.variable_name || !c.custom_name);
        if (incomplete) {
            alert('Lengkapi semua konfigurasi sensor!');
            return;
        }

        post('/memberarea/save-device');
    };

    return (
        <>
            <Head title="Setup Device - IoT Monitoring" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/memberarea/orders" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                                <span>←</span> Kembali ke Orders
                            </Link>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Order: {order.order_number}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="container mx-auto px-6 py-12 max-w-6xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">Setup Your IoT Device</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                            Isi informasi device dan pilih sensor yang ingin dimonitor
                        </p>
                        <div className="inline-block px-6 py-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <span className="font-semibold">Paket: {pkg.name}</span>
                            <span className="mx-2">•</span>
                            <span>Maksimal {pkg.max_sensors} sensor</span>
                            <span className="mx-2">•</span>
                            <span className="font-bold text-blue-600">
                                {pkg.base_price === 0 ? 'Gratis' : `Rp${(pkg.base_price / 1000).toFixed(0)}K/bulan`}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Column - Device Info */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-24">
                                    <CardHeader>
                                        <CardTitle>Informasi Device</CardTitle>
                                        <CardDescription>
                                            Masukkan detail perangkat IoT Anda
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="device_name">Nama Device *</Label>
                                            <Input
                                                id="device_name"
                                                placeholder="e.g. Smart Home Sensor"
                                                value={data.device_name}
                                                onChange={(e) => {
                                                    const sanitized = sanitizeInput(e.target.value);
                                                    setData('device_name', sanitized);
                                                }}
                                                required
                                                className="mt-1"
                                            />
                                            {errors.device_name && (
                                                <p className="text-sm text-red-600 mt-1">{errors.device_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="device_location">Lokasi Device *</Label>
                                            <Input
                                                id="device_location"
                                                placeholder="e.g. Ruang Tamu"
                                                value={data.device_location}
                                                onChange={(e) => {
                                                    const sanitized = sanitizeInput(e.target.value);
                                                    setData('device_location', sanitized);
                                                }}
                                                required
                                                className="mt-1"
                                            />
                                            {errors.device_location && (
                                                <p className="text-sm text-red-600 mt-1">{errors.device_location}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="device_description">Deskripsi (Opsional)</Label>
                                            <Textarea
                                                id="device_description"
                                                placeholder="Deskripsi singkat tentang device..."
                                                value={data.device_description}
                                                onChange={(e) => {
                                                    const sanitized = sanitizeInput(e.target.value);
                                                    setData('device_description', sanitized);
                                                }}
                                                rows={4}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="pt-4 border-t">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold">Sensor Dikonfigurasi:</span>
                                                <span className="text-blue-600 font-bold">{sensorConfigs.length}/{pkg.max_sensors}</span>
                                            </div>
                                            {sensorConfigs.length > 0 && (
                                                <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                                                    <div className="font-semibold mb-1">Variables:</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {sensorConfigs.map((config, i) => (
                                                            <span key={i} className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                                                                {config.variable_name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Sensor Configuration */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Konfigurasi Sensor</CardTitle>
                                        <CardDescription>
                                            Tambahkan sensor dengan custom name dan unit. Gunakan template atau buat custom.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {sensorConfigs.map((config, index) => (
                                                <div key={index} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                                                            <div>
                                                                <Label className="text-xs">Variable *</Label>
                                                                <select
                                                                    value={config.variable_name}
                                                                    onChange={(e) => updateSensorConfig(index, 'variable_name', e.target.value)}
                                                                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                                                    required
                                                                >
                                                                    <option value="">Pilih</option>
                                                                    {availableVariables.map(v => (
                                                                        <option 
                                                                            key={v} 
                                                                            value={v}
                                                                            disabled={sensorConfigs.some((c, i) => i !== index && c.variable_name === v)}
                                                                        >
                                                                            {v}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <Label className="text-xs">Template (Opsional)</Label>
                                                                <select
                                                                    value={config.sensor_id}
                                                                    onChange={(e) => updateSensorConfig(index, 'sensor_id', parseInt(e.target.value))}
                                                                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                                                >
                                                                    <option value="0">Custom</option>
                                                                    {sensors.map(sensor => (
                                                                        <option key={sensor.id} value={sensor.id}>
                                                                            {sensor.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <Label className="text-xs">Nama Sensor *</Label>
                                                                <Input
                                                                    value={config.custom_name}
                                                                    onChange={(e) => {
                                                                        const sanitized = sanitizeInput(e.target.value);
                                                                        updateSensorConfig(index, 'custom_name', sanitized);
                                                                    }}
                                                                    placeholder="e.g., Temperature"
                                                                    className="mt-1"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label className="text-xs">Unit</Label>
                                                                <Input
                                                                    value={config.unit}
                                                                    onChange={(e) => {
                                                                        const sanitized = sanitizeInput(e.target.value);
                                                                        updateSensorConfig(index, 'unit', sanitized);
                                                                    }}
                                                                    placeholder="e.g., °C"
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeSensor(index)}
                                                            className="mt-6"
                                                        >
                                                            ✕
                                                        </Button>
                                                    </div>

                                                    {config.custom_name && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                Preview: <span className="font-semibold">{config.variable_name}</span> = 
                                                                <span className="text-blue-600 ml-1">{config.custom_name}</span>
                                                                {config.unit && <span className="ml-1">({config.unit})</span>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addSensor}
                                                className="w-full"
                                            >
                                                + Tambah Sensor ({sensorConfigs.length}/{pkg.max_sensors})
                                            </Button>

                                            {sensorConfigs.length >= pkg.max_sensors && (
                                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                                    <p className="text-sm text-yellow-800 dark:text-yellow-300 font-semibold mb-2">
                                                        ⚠️ Batas Maksimal Tercapai
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                                        Anda telah mencapai batas maksimal {pkg.max_sensors} sensor untuk paket {pkg.name}.
                                                    </p>
                                                    <a href="/memberarea#paket">
                                                        <Button variant="outline" size="sm" className="w-full">
                                                            🚀 Upgrade Paket untuk Lebih Banyak Sensor
                                                        </Button>
                                                    </a>
                                                </div>
                                            )}

                                            {sensorConfigs.length === 0 && (
                                                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <h4 className="font-semibold text-sm mb-2">💡 Tips:</h4>
                                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                        <li>• Pilih variable untuk setiap sensor</li>
                                                        <li>• Gunakan template untuk auto-fill atau buat custom</li>
                                                        <li>• Berikan nama yang deskriptif untuk memudahkan monitoring</li>
                                                        <li>• Sertakan unit untuk interpretasi data yang lebih baik</li>
                                                    </ul>
                                                </div>
                                            )}

                                            {errors.sensors && (
                                                <p className="text-sm text-red-600 mt-2">{errors.sensors}</p>
                                            )}
                                        </div>

                                        <div className="mt-6 pt-6 border-t">
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                disabled={processing || sensorConfigs.length === 0}
                                            >
                                                {processing ? 'Processing...' : 'Simpan Device Setup'}
                                            </Button>
                                            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
                                                Device akan dibuat oleh admin setelah konfigurasi disimpan
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
