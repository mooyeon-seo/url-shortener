"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, QrCode, Link as LinkIcon, Loader2 } from "lucide-react";
import QRCode from 'qrcode';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'url' | 'qr'>('url');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');

  const generateShortUrl = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we're using a mock short URL
      // In a real app, you'd call your backend API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResult(`https://short.url/${Math.random().toString(36).substr(2, 6)}`);
      toast.success("URL shortened successfully!");
    } catch (error) {
      toast.error("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const generateQrCode = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      const qrDataUrl = await QRCode.toDataURL(url);
      setQrCode(qrDataUrl);
      toast.success("QR code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'url') {
      generateShortUrl();
    } else {
      generateQrCode();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="glass-card w-full max-w-2xl p-8 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">
            URL Shortener & QR Generator
          </h1>
          <p className="text-muted-foreground">
            Enter your URL below to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="url"
              placeholder="Enter your URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="url-input flex-1"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant={mode === 'url' ? "outline" : "default"}
                onClick={() => setMode('url')}
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                URL
              </Button>
              <Button
                type="button"
                variant={mode === 'qr' ? "outline" : "default"}
                onClick={() => setMode('qr')}
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : mode === 'url' ? (
              'Shorten URL'
            ) : (
              'Generate QR Code'
            )}
          </Button>
        </form>

        {(result || qrCode) && (
          <div className="result-appear">
            <Card className="p-6 space-y-4">
              {mode === 'url' && result && (
                <div className="flex items-center justify-between gap-4">
                  <Input value={result} readOnly className="flex-1" />
                  <Button onClick={copyToClipboard} variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {mode === 'qr' && qrCode && (
                <div className="flex flex-col items-center gap-4">
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="w-48 h-48 rounded-lg"
                  />
                  <Button onClick={downloadQRCode} variant="outline">
                    Download QR Code
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UrlShortener;