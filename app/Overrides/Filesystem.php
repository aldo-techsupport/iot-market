<?php

namespace App\Overrides;

use Illuminate\Filesystem\Filesystem as BaseFilesystem;
use ErrorException;

class Filesystem extends BaseFilesystem
{
    /**
     * Replace a given string within a given file.
     *
     * @param  string  $path
     * @param  string  $content
     * @param  int|null  $mode
     * @return void
     */
    public function replace($path, $content, $mode = null)
    {
        clearstatcache(true, $path);

        $path = realpath($path) ?: $path;

        $tempPath = storage_path('framework/temp/' . uniqid('temp_', true));

        // Ensure temp directory exists
        if (!is_dir(dirname($tempPath))) {
            mkdir(dirname($tempPath), 0755, true);
        }

        // Write to temp file
        file_put_contents($tempPath, $content);

        // Set permissions - use mode if provided, or copy from original file if it exists
        if ($mode !== null) {
            chmod($tempPath, $mode);
        } elseif (file_exists($path)) {
            chmod($tempPath, fileperms($path) & 0777);
        } else {
            chmod($tempPath, 0644);
        }

        // Rename temp file to target
        rename($tempPath, $path);
    }
}
