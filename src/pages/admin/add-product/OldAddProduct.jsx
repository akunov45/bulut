// import { useState } from 'react';
// import productApi from '../../../service/product.api';
// import FileUploadApi from '../../../service/file-upload.api';
// import { useNavigate } from 'react-router-dom';
// import SelectField from '../../../Components/ui/select-field/SelectField';
// import InputField from '../../../Components/ui/input-field/InputField';
// import TextareaField from '../../../Components/ui/text-area/TextArea';
// import ImagePreview from '../../../Components/ui/image-preview/ImagePreview';
// import {Spin} from "antd";
// import {LoadingOutlined} from "@ant-design/icons"; // Новый компонент для работы с изображениями
//
// const AddProduct = () => {
//   const navigate = useNavigate();
//
//   const [files, setFiles] = useState([]);
//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     description: '',
//     stock: '',
//     category_id: '',
//     subcategory_id: '',
//     images: [],
//   });
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadingImages, setUploadingImages] = useState([]); // Стейт для отслеживания загрузки изображений
//
//   const fileUploadApi = new FileUploadApi('photos');
//
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({ ...prevState, [name]: value }));
//   };
//
//   const handleImageChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (files.length + selectedFiles.length > 4) {
//       setError('Можно загрузить не более 4 изображений.');
//       setTimeout(() => setError(null), 3000);
//       return;
//     }
//     const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
//     setPreviewUrls((prevPreviewUrls) => [...prevPreviewUrls, ...newPreviewUrls]);
//     setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
//
//     selectedFiles.forEach((file) => {
//       uploadImage(file); // Начинаем загрузку изображения по мере его выбора
//     });
//   };
//
//   const uploadImage = async (file) => {
//     try {
//       setUploadingImages((prevUploading) => [...prevUploading, file.name]); // Добавляем файл в список загружаемых изображений
//       const path = `uploads/${file.name}`;
//       const imageUrl = await fileUploadApi.uploadFile(file, path);
//
//       setFormData((prevData) => ({
//         ...prevData,
//         images: [...prevData.images, imageUrl], // Добавляем загруженную картинку в массив изображений
//       }));
//     } catch (error) {
//       console.error('Ошибка при загрузке изображения:', error);
//       setError('Не удалось загрузить одно или несколько изображений. Попробуйте снова.');
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setUploadingImages((prevUploading) => prevUploading.filter((name) => name !== file.name)); // Убираем файл из списка загружаемых
//     }
//   };
//
//   const handleDeleteImage = (index) => {
//     const updatedFiles = files.filter((_, idx) => idx !== index);
//     const updatedPreviewUrls = previewUrls.filter((_, idx) => idx !== index);
//     setFiles(updatedFiles);
//     setPreviewUrls(updatedPreviewUrls);
//   };
//
//   const handleAddProduct = async () => {
//     if (!formData.name.trim() || !formData.price || !formData.description.trim() || !formData.category_id || !formData.subcategory_id) {
//       setError('Пожалуйста, заполните все поля.');
//       setTimeout(() => setError(null), 3000);
//       return;
//     }
//
//     if (uploadingImages.length > 0) {
//       setError('Подождите, пока изображения загрузятся.');
//       return;
//     }
//
//     setIsSubmitting(true);
//
//     try {
//       const newProduct = {
//         ...formData,
//         price: parseFloat(formData.price),
//         stock: parseInt(formData.stock, 10),
//         category_id: parseInt(formData.category_id, 10),
//         subcategory_id: parseInt(formData.subcategory_id, 10),
//       };
//
//       await productApi.addProduct(newProduct);
//       alert('Продукт успешно добавлен');
//       resetForm();
//       navigate('/admin/products/');
//     } catch (error) {
//       console.error('Ошибка при добавлении продукта:', error);
//       setError('Не удалось добавить продукт. Попробуйте снова.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//
//   const resetForm = () => {
//     previewUrls.forEach((url) => URL.revokeObjectURL(url));
//     setFormData({
//       name: '',
//       price: '',
//       description: '',
//       stock: '',
//       category_id: '',
//       subcategory_id: '',
//       images: [],
//     });
//     setFiles([]);
//     setPreviewUrls([]);
//     setError(null);
//   };
//
//   return (
//     <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
//       <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Добавить новый товар</h2>
//       {error && (
//         <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
//           {error}
//         </div>
//       )}
//
//       <div className="flex space-x-8">
//         {/* Левая часть - текстовые поля */}
//         <div className="flex-1 space-y-6">
//           <form onSubmit={(e) => e.preventDefault()}>
//             <div className="space-y-4">
//               <InputField label="Название" name="name" value={formData.name} onChange={handleInputChange} />
//               <InputField label="Цена" name="price" type="number" value={formData.price} onChange={handleInputChange} />
//               <TextareaField label="Описание" name="description" value={formData.description} onChange={handleInputChange} />
//               <InputField label="Количество на складе" name="stock" type="number" value={formData.stock} onChange={handleInputChange} />
//             </div>
//
//             <div className="space-y-4">
//               <SelectField
//                 label="Категория"
//                 name="category_id"
//                 value={formData.category_id}
//                 options={[
//                   { value: '', label: 'Выберите категорию' },
//                   { value: '1', label: 'Мужчины' },
//                   { value: '2', label: 'Женщины' },
//                 ]}
//                 onChange={handleInputChange}
//               />
//               <SelectField
//                 label="Подкатегория"
//                 name="subcategory_id"
//                 value={formData.subcategory_id}
//                 options={[
//                   { value: '', label: 'Выберите подкатегорию' },
//                   { value: '1', label: 'Футболки' },
//                   { value: '2', label: 'Брюки' },
//                   { value: '3', label: 'Двойка для Девушек' },
//                 ]}
//                 onChange={handleInputChange}
//               />
//             </div>
//           </form>
//         </div>
//
//         {/* Правая часть - загрузка изображений */}
//         <div className="flex-1 space-y-4">
//           <div className="space-y-4">
//             <label className="block text-gray-700 font-medium">Изображения (до 4 штук)</label>
//             <input
//               name="images"
//               type="file"
//               multiple
//               onChange={handleImageChange}
//               className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700"
//             />
//           </div>
//
//           {previewUrls.length > 0 && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
//               {previewUrls.map((url, index) => (
//                 <div key={index} className="relative">
//                   <img src={url} alt={`preview-${index}`} className="w-full h-32 object-cover rounded-lg shadow-md" />
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteImage(index)}
//                     className="absolute top-2 right-2 bg-red-600 text-white text-sm rounded-full p-1 hover:bg-red-700"
//                   >
//                     X
//                   </button>
//                   {uploadingImages.includes(files[index].name) && (
//                     <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center rounded-lg">
//                       <Spin
//                         indicator={
//                           <LoadingOutlined
//                             style={{
//                               fontSize: 48,
//                             }}
//                             spin
//                           />
//                         }
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//
//       <button
//         onClick={handleAddProduct}
//         disabled={isSubmitting}
//         className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 mt-6"
//       >
//         {isSubmitting ? 'Сохранение...' : 'Добавить товар'}
//       </button>
//     </div>
//   );
// };
//
// export default AddProduct;
