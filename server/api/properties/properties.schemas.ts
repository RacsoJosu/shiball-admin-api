import z from 'zod';

export const inputPropertiesCreateSchema = z.object({
  description: z
    .string()
    .min(25, 'La descripción debe tener al menos 25 caracteres'),
  capacity: z.coerce
    .number({
      message: 'Ingresa un numero entero',
    })
    .min(1, 'Debe ser mayor a 0')
    .max(15, 'Debe ser menor a 15')
    .int('El valor debe ser un entero'),
  // fkIdUser: z.string().uuid(),
  type: z.enum(['DWELLING', 'VEHICLE']),
});

export const ENUM_TYPE_PROPERTIES_VALUES = {
  DWELLING: 'DWELLING',
  VEHICLE: 'VEHICLE',
} as const;
export type TypeProperties =
  (typeof ENUM_TYPE_PROPERTIES_VALUES)[keyof typeof ENUM_TYPE_PROPERTIES_VALUES];
// Schema para propiedades tipo Dwelling

export const dwellingSchema = z.object({
  city: z.string().min(3, { message: 'El nombre de la ciudad es necesaria' }),
  country: z.string().min(3, { message: 'El nombre del pais es necesario' }),
  address: z.string().min(25, {
    message: 'Es necesario que introduzcas un valor con mas de 25 caracteres',
  }),
  latitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Debe ser un número válido'),
  longitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Debe ser un número válido'),
});

export const vehicleSchema = z.object({
  brand: z.string().min(1, { message: 'El campo es obligatorio' }),
  model: z.string().min(1, { message: 'El campo es obligatorio' }),
  typeVehicle: z.enum(['MECHANICAL', 'ELECTRIC'], {
    message: 'El campo es obligatorio',
  }),
});
export const dwellingFormSchema = inputPropertiesCreateSchema.extend({
  type: z
    .literal('DWELLING', {
      message: 'El tipo de propiedad es obligatorio',
    })
    .refine((value) => value, {
      message: 'El tipo de propiedad es obligatorio',
    }),
  ...dwellingSchema.shape,
});

// Schema para propiedades tipo Vehicle
export const vehicleFormSchema = inputPropertiesCreateSchema.extend({
  type: z
    .literal('VEHICLE', {
      message: 'El tipo de propiedad es obligatorio',
    })
    .refine((value) => value, {
      message: 'El tipo de propiedad es obligatorio',
    }),
  ...vehicleSchema.shape,
});

export const propertySchema = z.discriminatedUnion(
  'type',
  [dwellingFormSchema, vehicleFormSchema],
  {
    message: 'El tipo de propiedad es obligatorio',
  }
);
