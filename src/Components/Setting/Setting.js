import React, { useState } from "react";
import { getCurrentUserId, updateUser, getUser } from "../../Services/apiUsers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import supabase, { supabaseUrl } from "../../Services/Supabase";
import "./setting.css";
import { getAppSetting } from "../../Services/apiAppSetting";
import useSupabaseRealtime from "../../Services/useSupabaseRealtime";
const Setting = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  useSupabaseRealtime("appSetting", "appSettings");

  const userId = getCurrentUserId();

  const {
    isLoading,
    data: users,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const { isLoading: appSettingLoading, data: appSetting } = useQuery({
    queryKey: ["appSettings"],
    queryFn: getAppSetting,
  });
  const isAppClosed = appSetting?.[0].isAppClosed;
  const isDelivery = appSetting?.[0].isDeliveryAvailable;

  const [appStatus, setAppStatus] = useState(isAppClosed);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(isDelivery);

  const updateAppStatus = async () => {
    const newStatus = !appStatus;
    setAppStatus(newStatus);
    const { error } = await supabase
      .from("appSetting")
      .update({ isAppClosed: newStatus })
      .eq("id", 1);

    if (error) {
      console.error("Error updating isDeliveryAvailable:", error);
      toast.error("Error updating delivery status");
    } else {
      toast.success("App status updated successfully");
    }
  };

  const updateDeliveryStatus = async () => {
    const newStatus = !isDeliveryAvailable;
    setIsDeliveryAvailable(newStatus);
    const { error } = await supabase
      .from("appSetting")
      .update({ isDeliveryAvailable: newStatus })
      .eq("id", 1);

    if (error) {
      console.error("Error updating isDeliveryAvailable:", error);
      toast.error("Error updating delivery status");
    } else {
      toast.success("Delivery status updated successfully");
    }
  };

  const currentUser = users?.filter((user) => user.id === userId);

  const user = currentUser?.[0];

  const { mutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Information updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = async (data) => {
    const img =
      typeof data.logoImage === "string" ? data.logoImage : data.logoImage[0];
    const hasImagePath = img.startsWith?.(supabaseUrl);

    const imageName = `${Math.random()}-${img.name}`.replaceAll("/", "");
    const imagePath = hasImagePath
      ? img
      : `${supabaseUrl}/storage/v1/object/public/Logo_img/${imageName}`;

    const imageData = {
      imagePath: imagePath,
      logoName: data.logoName,
      imageName: imageName,
      userId: userId,
    };

    if (!hasImagePath) {
      const { error: storageError } = await supabase.storage
        .from("Logo_img")
        .upload(imageName, img);

      if (storageError) {
        console.error(storageError);
        toast.error("Logo image could not be uploaded");
        return;
      }
    }

    mutate({ newData: data, id: userId, imageData });
  };

  const { register, handleSubmit, reset } = useForm({ defaultValues: user });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <div className="settingContainer">
      <form onSubmit={handleSubmit(onSubmit)} className="content">
        <div className="head">
          {isEditing && (
            <input
              type="file"
              name="logoImage"
              id="logoImage"
              {...register("logoImage")}
            />
          )}
          <div className="logoImage">
            <img src={user?.logoImage} alt="" />
          </div>
          <div className="details">
            {isEditing && (
              <>
                <input
                className="settingInput"
                  autoFocus
                  required
                  type="text"
                  name="logoName"
                  id="logoName"
                  {...register("logoName")}
                  placeholder="LogoName"
                />
                <input
                className="settingInput"

                  required
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  {...register("address")}
                />
                <input
                className="settingInput"

                  required

                  type="Number"
                  placeholder="phone Number"
                  name="phone"
                  id="phone"
                  {...register("phone")}
                />
                <input
                className="settingInput"

                  required
                  type="email"
                  placeholder="email Address"
                  name="personalEmail"
                  id="personalEmail"
                  {...register("personalEmail")}
                />
              </>
            )}
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
          <p
            onClick={() => {
              setIsEditing((prev) => !prev);
            }}
            className="editIcon"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </p>
        </div>
      </form>
      <input
        id="checkbox_toggle"
        type="checkbox"
        class="check"
        checked={appStatus}
        onChange={updateAppStatus}
      />
      <div class="checkbox">
        <label class="slide" for="checkbox_toggle">
          <label
            style={{ transform: `translateX(${isAppClosed ? 0 : "113px"})` }}
            class="toggle"
            for="checkbox_toggle"
          ></label>
          <label class="text" for="checkbox_toggle">
            Open
          </label>
          <label class="text" for="checkbox_toggle">
            Close
          </label>
        </label>
      </div>

      <input
        id="app_checkbox_toggle"
        type="checkbox"
        class="app_check"
        checked={isDeliveryAvailable}
        onChange={updateDeliveryStatus}
      />
      <div class="app_checkbox">
        <label class="app_slide" for="app_checkbox_toggle">
          <label
            style={{ transform: `translateX(${isDelivery ? 0 : "113px"})` }}
            class="app_toggle"
            for="app_checkbox_toggle"
          ></label>
          <label class="text" for="app_checkbox_toggle">
            ON
          </label>
          <label class="text" for="app_checkbox_toggle">
            OFF
          </label>
        </label>
      </div>
    </div>
  );
};

export default Setting;
