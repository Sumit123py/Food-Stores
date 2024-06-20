import React, { useState } from 'react';
import { getCurrentUserId, updateUser, getUser } from '../../Services/apiUsers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import supabase, { supabaseUrl } from '../../Services/Supabase';
import './setting.css'
const Setting = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const userId = getCurrentUserId();

  const { isLoading, data: users, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const currentUser = users?.filter(
    (user) => user.id === userId
  );

  const user = currentUser?.[0];

  const { mutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Information updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      refetch()
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = async (data) => {
    const img = typeof data.logoImage === 'string' ? data.logoImage : data.logoImage[0];
    const hasImagePath = img.startsWith?.(supabaseUrl);

    const imageName = `${Math.random()}-${img.name}`.replaceAll('/', '');
    const imagePath = hasImagePath ? img : `${supabaseUrl}/storage/v1/object/public/Logo_img/${imageName}`;

    const imageData = {
      imagePath: imagePath,
      logoName: data.logoName,
      imageName: imageName,
      userId: userId,
    };

    if (!hasImagePath) {
      const { error: storageError } = await supabase
        .storage
        .from('Logo_img')
        .upload(imageName, img);

      if (storageError) {
        console.error(storageError);
        toast.error("Logo image could not be uploaded");
        return;
      }
    }

    mutate({ newData: data, id: userId, imageData });
  };

  const { register, handleSubmit, reset } = useForm({defaultValues: user});

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <div className='settingContainer'>
      <form onSubmit={handleSubmit(onSubmit)} className="content">
        <div className="head">
          {isEditing && <input type="file" name="logoImage" id="logoImage" {...register("logoImage")} />}
          <div className="logoImage">
            <img src={user?.logoImage} alt="" />
            
          </div>
          <div className="details">
            {isEditing && 
            (
            <>
            <input autoFocus required type="text" name="logoName" id="logoName"  {...register("logoName")} placeholder='LogoName' />
            <input required type="text" name="address" id="address" placeholder='Address'  {...register("address")} />
            <input required type="Number" placeholder='phone Number' name="phone" id="phone"  {...register("phone")} />
            <input required type="email" placeholder='email Address' name="personalEmail" id="personalEmail"  {...register("personalEmail")} />
            </>)
            }
            {!isEditing && (
            <>
            <p className="logoName">{user?.logoName}</p>
            <p className="address">{user?.address}</p>
            <p className="phone">{user?.phone}</p>
            <p className="email">{user?.personalEmail}</p>
            </>
            )}
            
            
            
          </div>
          {isEditing && <input type="submit" value="submit" />}
          <p onClick={() => {
            setIsEditing((prev) => !prev)
            }} className="editIcon"><i className="fa-solid fa-pen-to-square"></i></p>
        </div>
      </form>
    </div>
  );
};

export default Setting;
