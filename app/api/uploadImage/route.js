// app/api/uploadImage/route.js
import fs from 'fs';
import path from 'path';
import { ConnectDB } from '@/lib/config/db'; // adjust if path differs
import ImageModel from '@/lib/models/Image'; // optional - adjust path if needed

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    // Parse multipart/form-data using the Web API
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // `file` is a File-like object (has name, type, arrayBuffer())
    const originalName = file.name || `upload_${Date.now()}`;
    const cleanName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${cleanName}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // ensure directory exists
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // convert to buffer and write
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    // public URL (relative) - you can make it absolute in production
    const publicUrl = `/uploads/${filename}`;

    // optionally save metadata to MongoDB (non-blocking for UX; but we await here to keep simple)
    try {
      await ConnectDB();
      await ImageModel.create({
        filename,
        originalName,
        url: publicUrl,
        size: buffer.length,
        createdAt: new Date(),
      });
    } catch (mongoErr) {
      console.error('Warning: saving metadata to Mongo failed:', mongoErr);
      // don't fail the whole request because metadata save failed
    }

    return new Response(JSON.stringify({ publicUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Upload error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
