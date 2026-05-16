<?php

namespace App\Containers\Upload\UI\API\Controllers;

use App\Ship\Parents\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file'   => 'required|file|max:10240',
            'folder' => 'sometimes|string|max:100',
        ]);

        $folder   = $request->input('folder', 'uploads');
        $ext      = $request->file('file')->getClientOriginalExtension();
        $filename = Str::uuid().'.'.$ext;
        $path     = $folder.'/'.$filename;

        Storage::disk('s3')->put($path, file_get_contents($request->file('file')->getRealPath()));

        $url = rtrim(config('filesystems.disks.s3.url'), '/')
            .'/'.config('filesystems.disks.s3.bucket')
            .'/'.$path;

        return response()->json(['url' => $url], 201);
    }

    public function delete(Request $request): JsonResponse
    {
        $request->validate(['path' => 'required|string']);

        Storage::disk('s3')->delete($request->input('path'));

        return response()->json(['deleted' => true]);
    }
}
