import { getDownloadURL,getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { FileInput, Select,TextInput,Button, Alert } from 'flowbite-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
    const[file,setFile]=useState(null);
    const[imageUploadProgress,setImageUploadProgress]=useState(null);
    const[imageUploadError,setImageUploadError]=useState(null);
    const [formData,setFormData]=useState({});
    const [publishError,setPublishError] =useState(null);
    const navigate=useNavigate();
    const handleUploadImage=async()=>{
        try{
            if(!file){
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError('null');
            const storage =getStorage(app);
            const fileName =new Date().getTime()+'-'+file.name;
            const storageRef =ref(storage,fileName);
            const uploadTask =uploadBytesResumable(storageRef,file);
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress =
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    setImageUploadProgress(progress.toFixed(0));
                    // setImageUploadProgress(null);
                },
                (error)=>{
                    setImageUploadError('Could not upload image (file must be less than 2MB)');
                    setImageUploadProgress(null);
                    setFile(null);

                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        // setImageFileUrl(downloadURL);
                        setFormData((formData) => {
                            return {
                              ...formData,   // Spread Operator               
                              image: downloadURL
                            }
                          })
                        setImageUploadError(null);
                        setImageUploadProgress(null);
                    
                    })
                }
            );
        }catch(error){
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
        }
    }
    const handleInputText=(event)=>{
        setFormData((formData) => {
            return {
              ...formData,                  
              title: event.target.value,
            }
          })
    }
    const handleInputSelect=(event)=>{
        setFormData((formData) => {
            return {
              ...formData,                  
              category: event.target.value,
            }
          })
    }
    const handleInputContent=(value)=>{
        setFormData((formData) => {
            return {
              ...formData,                  
              content: value,
            }
          })
    }
    const handleSubmit= async (event)=>{
        event.preventDefault();
        try{
            const res =await fetch('api/post/create',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formData)
              });
              const data=await res.json();
              if(!res.ok){
                setPublishError(data.message)
                return
              }
            //   if(data.success === false){
            //     setPublishError(data.message)
            //     return
            //   }
              if(res.ok){
                setPublishError(null)
                navigate(`/post/${data.slug}`)
              }
        }catch(error){
            setPublishError('Something went wrong')
        }
    }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={handleInputText}/>
                <Select onChange={handleInputSelect}>
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nodejs">Node.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-slate-300 border-dotted p-2 rounded-md'>
                <FileInput type='file' accept='image/*' onChange={(event)=>setFile(event.target.files[0])}/>
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
                                                                                                                {
                                                                                                                    imageUploadProgress?(
                                                                                                                        <div className='w-8 h-8'>
                                                                                                                            <CircularProgressbar
                                                                                                                                value={imageUploadProgress}
                                                                                                                                text={`${imageUploadProgress || 0}%`}
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    ):(
                                                                                                                        'Upload Image'
                                                                                                                    )

                                                                                                                }
                </Button>
            </div>
            {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
            {formData.image && <img src={formData.image} alt='upload' className='w-full h-72 object-cover'/>}
            <ReactQuill theme="snow" placeholder='write something...' className='h-72 mb-12' required onChange={handleInputContent}/>
            <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
            {publishError && <Alert color='failure'>{publishError}</Alert>}
        </form>
    </div>
  )
}
