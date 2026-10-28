import React, { useState } from 'react'
import SupplierLayout from '../../components/supplier/SupplierLayout'

const SupplierBulkImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[] | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      const lines = text.split('\n').filter(l => l.trim())
      if (lines.length < 2) return
      const headers = lines[0].split(',').map(h => h.trim())
      const rows = lines.slice(1, 6).map(line => {
        const cols = line.split(',').map(c => c.trim())
        return headers.reduce((obj: any, h, i) => { obj[h] = cols[i] || ''; return obj }, {})
      })
      setPreview(rows)
    }
    reader.readAsText(f)
  }

  return (
    <SupplierLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Bulk Import</h1>
          <p className="text-[#805030] font-medium text-sm">Upload multiple products at once via CSV</p>
        </div>

        <div className="bg-white rounded-xl border border-[#dca079]/10 p-8 shadow-sm">
          <div className="border-2 border-dashed border-[#dca079]/30 rounded-xl p-12 flex flex-col items-center justify-center hover:bg-[#fff4f0] transition-colors cursor-pointer" onClick={() => document.getElementById('csv-input')?.click()}>
            <span className="material-symbols-outlined text-5xl text-[#805030] mb-3">upload_file</span>
            <p className="text-sm font-bold text-[#4a2507]">Drop CSV file here or click to upload</p>
            <p className="text-[10px] text-[#805030] mt-1">Columns: name, description, price, stock, category_id, badge, image</p>
            <input id="csv-input" type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </div>

          {file && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#4a2507]">
              <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}

          {preview && (
            <div className="mt-6">
              <h3 className="font-bold text-sm text-[#4a2507] mb-3">Preview ({preview.length} rows)</h3>
              <div className="overflow-x-auto rounded-lg border border-[#dca079]/10">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#fff4f0] border-b border-[#dca079]/20">
                      {Object.keys(preview[0]).map(k => (
                        <th key={k} className="px-3 py-2 font-bold text-[#805030] uppercase">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ffede4]">
                    {preview.map((row, i) => (
                      <tr key={i} className="hover:bg-[#fff4f0]">
                        {Object.values(row).map((v: any, j) => (
                          <td key={j} className="px-3 py-2 text-[#4a2507]">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button className="px-5 py-2 border border-[#dca079]/30 rounded-full text-xs font-bold text-[#805030] hover:bg-[#ffede4]">Cancel</button>
                <button className="px-5 py-2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-xs font-bold shadow-sm">Import {preview.length}+ Products</button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-xl border border-[#dca079]/10 p-6 shadow-sm">
          <h3 className="font-bold text-sm text-[#4a2507] mb-3">CSV Format Reference</h3>
          <div className="bg-[#fff4f0] rounded-lg p-4 text-xs font-mono text-[#805030]">
            <p>name,description,price,stock,category_id,badge,image</p>
            <p className="text-green-700">"Premium Leather Tote","Genuine leather with gold hardware",189.99,25,cat-luxury,"Best Seller",https://example.com/img.jpg</p>
            <p className="text-green-700">"Mini Crossbody","Compact vegan leather bag",79.99,50,cat-luxury,,https://example.com/img2.jpg</p>
          </div>
        </div>
      </div>
    </SupplierLayout>
  )
}

export default SupplierBulkImport
