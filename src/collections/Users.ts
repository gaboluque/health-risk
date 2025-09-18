import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt'],
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
    // Patient profile (only for users with role 'user')
    {
      name: 'profile',
      type: 'group',
      label: 'Patient Profile',
      admin: {
        condition: (data) => data?.role === 'user',
        description: 'Patient profile information (only for regular users)',
      },
      defaultValue: undefined,
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'First Name',
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Last Name',
        },
        {
          name: 'birthDate',
          type: 'date',
          required: true,
          label: 'Birth Date',
          admin: {
            description: 'Date of birth',
          },
        },
        {
          name: 'height',
          type: 'number',
          required: true,
          label: 'Height (cm)',
          min: 50,
          max: 300,
        },
        {
          name: 'weight',
          type: 'number',
          required: true,
          label: 'Weight (kg)',
          min: 10,
          max: 500,
        },
        {
          name: 'sex',
          type: 'select',
          required: true,
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
        {
          name: 'currentSmoking',
          type: 'checkbox',
          label: 'Currently Smoking',
          defaultValue: false,
        },
        {
          name: 'idNumber',
          type: 'text',
          required: true,
          unique: true,
          label: 'ID Number',
          admin: {
            description: 'National identification number',
          },
        },
        {
          name: 'socialSecurityNumber',
          type: 'text',
          label: 'Social Security Number',
          admin: {
            description: 'Numero de Caja de Seguro Social (optional)',
          },
        },
        {
          name: 'cellphoneNumber',
          type: 'text',
          required: true,
          unique: true,
          label: 'Cellphone Number',
        },
        {
          name: 'privateInsurance',
          type: 'text',
          label: 'Private Insurance',
          admin: {
            description: 'Seguro privado',
          },
        },
        // Calculated fields (computed from the above)
        {
          name: 'age',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Calculated from birth date',
          },
          hooks: {
            beforeChange: [
              ({ data, siblingData }) => {
                const profileData = siblingData || data?.profile
                if (profileData && profileData.birthDate) {
                  const birthDate = new Date(profileData.birthDate)
                  const today = new Date()
                  let age = today.getFullYear() - birthDate.getFullYear()
                  const monthDiff = today.getMonth() - birthDate.getMonth()

                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--
                  }

                  return age
                }
                return profileData?.age
              },
            ],
          },
        },
        {
          name: 'bmi',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Calculated from height and weight (BMI = weight / (height/100)²)',
          },
          hooks: {
            beforeChange: [
              ({ data, siblingData }) => {
                const profileData = siblingData || data?.profile
                if (profileData && profileData.height && profileData.weight) {
                  const heightInMeters = profileData.height / 100
                  return (
                    Math.round((profileData.weight / (heightInMeters * heightInMeters)) * 10) / 10
                  )
                }
                return profileData?.bmi
              },
            ],
          },
        },
      ],
    },
  ],
}
