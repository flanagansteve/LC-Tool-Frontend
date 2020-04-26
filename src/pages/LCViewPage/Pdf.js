import React, { useRef, useEffect, useState } from 'react';
import MoonLoader from "react-spinners/MoonLoader";
import { css } from '@emotion/core';
import pdfjs from 'pdfjs-dist';

import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import config from '../../config';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfComponent = ({ src }) => {
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      setIsLoading(true);
      const loadingTask = pdfjs.getDocument(src);

      const pdf = await loadingTask.promise;

      const firstPageNumber = 1;

      const page = await pdf.getPage(firstPageNumber);

      const scale = 1;
      const viewport = page.getViewport({scale: scale});

      // Prepare canvas using PDF page dimensions
      const canvas = canvasRef.current;

      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);

      await renderTask.promise;
    };

    fetchPdf()
      .then(() => setIsLoading(false));
  }, [src]);

  return (
    <>
    {isLoading && 
          <MoonLoader
            size={45}
            color={config.accentColor}
            loading={true}
            css={css`
              margin: 0 auto;
            `}
          />
    }
    <canvas
      ref={canvasRef}
      width={700}
      height={window.innerHeight}
      style={{border: '1px solid #cdcdcd', display: isLoading ? 'none' : 'block'}}
    />
    </>
  );
}

export default PdfComponent;
