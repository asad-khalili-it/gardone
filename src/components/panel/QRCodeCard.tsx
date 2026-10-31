"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Printer, Copy, Check, Sparkles } from "lucide-react";

interface QRCodeCardProps {
  url: string;
  storeName: string;
}

export default function QRCodeCard({ url, storeName }: QRCodeCardProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, {
      width: 450,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((res) => setDataUrl(res))
      .catch((err) => console.error("QR Error:", err));
  }, [url]);

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <meta charset="utf-8">
          <title>بارکد گردونه شانس - ${storeName}</title>
          <style>
            @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
            body {
              font-family: 'Vazirmatn', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #fff;
              color: #0f172a;
              text-align: center;
            }
            .poster {
              width: 400px;
              border: 3px dashed #d97706;
              border-radius: 30px;
              padding: 40px 30px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            }
            h1 {
              font-size: 26px;
              margin: 0 0 8px 0;
              color: #b45309;
            }
            p.sub {
              font-size: 14px;
              color: #64748b;
              margin: 0 0 25px 0;
            }
            img {
              width: 280px;
              height: 280px;
              border-radius: 16px;
              border: 1px solid #e2e8f0;
            }
            .cta {
              font-size: 18px;
              font-weight: 800;
              color: #047857;
              margin-top: 25px;
            }
            .link {
              font-size: 11px;
              color: #94a3b8;
              margin-top: 15px;
              direction: ltr;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="poster">
            <h1>🎡 گردونه شانس ${storeName}</h1>
            <p class="sub">بارکد را با دوربین موبایل اسکن کنید و تخفیف ویژه بگیرید!</p>
            <img src="${dataUrl}" alt="QR Code" />
            <div class="cta">🎯 همین حالا شانستو امتحان کن!</div>
            <div class="link">${url}</div>
          </div>
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="space-y-3 text-center md:text-right flex-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>بارکد اختصاصی آماده چاپ</span>
        </span>

        <h2 className="text-xl md:text-2xl font-black text-white">
          QR کد مشتریان فروشگاه: {storeName}
        </h2>

        <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
          این بارکد به طور هوشمند و خودکار برای فروشگاه شما تولید شده است. می‌توانید آن را با یک کلیک پرینت گرفته یا دانلود کنید و پشت شیشه مغازه یا روی پیشخوان نصب فرمایید.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {dataUrl && (
            <a
              href={dataUrl}
              download={`qrcode-${storeName}.png`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>دانلود تصویر باکیفیت (PNG)</span>
            </a>
          )}

          <button
            onClick={handlePrint}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>چاپ پوستر مغازه (Print)</span>
          </button>

          <button
            onClick={copyUrl}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>کپی لینک گردونه</span>
              </>
            )}
          </button>
        </div>

        <div className="font-mono text-amber-400/80 text-xs dir-ltr pt-1">
          {url}
        </div>
      </div>

      {/* QR Visual Card */}
      <div className="bg-white p-5 rounded-3xl shadow-2xl shrink-0 flex flex-col items-center border-4 border-amber-500/30">
        {dataUrl ? (
          <img src={dataUrl} alt="QR Code" className="w-40 h-40 object-contain rounded-xl" />
        ) : (
          <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
            در حال ساخت QR...
          </div>
        )}
        <span className="text-[11px] font-extrabold text-slate-800 mt-2">
          اسکن با دوربین موبایل
        </span>
      </div>
    </div>
  );
}
