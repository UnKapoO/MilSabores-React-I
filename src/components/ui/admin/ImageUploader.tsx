import React, { useState, useRef } from 'react';

// Interfaz para definir las props
interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void; 
  initialPreviewUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  initialPreviewUrl 
}) => {
  
  // ESTADO
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para manejar el archivo seleccionado
  const handleFileChange = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelect(file);
    } else {
      // Limpiamos el input file real
      if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
      }
      setPreviewUrl(null);
      onImageSelect(null);
    }
  };

  // Manejar el drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };
  
  // Simular el clic en el input file oculto
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };
  
  // Manejar la selección por el botón/input file
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };
  
  // Renderizado condicional del contenido del área de carga
  const renderContent = () => {
    if (previewUrl) {
      return (
        // Aseguramos que la imagen use el espacio y no se deforme
        <img 
          src={previewUrl} 
          alt="Previsualización" 
          className="w-full h-full object-cover rounded-xl" 
        />
      );
    }
    return (
      <div className="flex flex-col items-center justify-center text-gray-500">
        <i className="fa-solid fa-cloud-arrow-up text-4xl mb-2 text-rose-500"></i>
        <p className="text-sm font-medium">Arrastra y suelta aquí, o haz clic para seleccionar</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Área de Arrastre y Suelta */}
      <div 
        className="relative w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center overflow-hidden"
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={handleDrop}
        onClick={openFilePicker}
      >
        {renderContent()}
      </div>
      
      {/* Botón y Input File Oculto */}
      <div className="flex justify-between items-center">
        
        {/* Input file real (oculto) */}
        <input 
          type="file"
          accept="image/*"
          ref={fileInputRef} 
          onChange={handleInputChange}
          className="hidden" 
        />
        
        {/* Botón de acción */}
        <button 
          type="button" 
          onClick={openFilePicker}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
        >
          {previewUrl ? 'Cambiar Imagen' : 'Seleccionar Archivo'}
        </button>

        {/* Botón para Eliminar Previsualización */}
        {previewUrl && (
          <button 
            type="button" 
            onClick={() => handleFileChange(null)}
            className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors"
          >
            <i className="fa-solid fa-trash mr-1"></i> Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;