/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';

import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
  example: string
  exampleRequired : string
}

export default function App() {
  const { register, handleSubmit, watch, formState: {errors} } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  console.log(watch("example"))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="test" {...register("example")} />

      <input {...register("exampleRequired", { required: true })} />
      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  )
}
