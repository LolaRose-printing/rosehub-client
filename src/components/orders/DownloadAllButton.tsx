'use client';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type FileData = {
  name: string;
  url: string;
};

type Props = {
  files: FileData[];
};

export const DownloadAllButton = ({ files }: Props) => {
  const downloadAllFiles = async () => {
    const zip = new JSZip();
    for (const file of files) {
      const response = await fetch(file.url);
      const blob = await response.blob();
      zip.file(file.name, blob);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'print-files.zip');
  };

  return (
    <button
      onClick={downloadAllFiles}
      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
    >
      Download All Files
    </button>
  );
};
