import { IsBoolean, IsDateString, IsNotEmpty, IsString, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { parse, isValid, format } from 'date-fns';

// Customized validator to validate real DD/MM/YYYY dates
// https://github.com/typestack/class-validator#custom-validation-decorators
function IsRealDDMMYYYY(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsRealDDMMYYYY',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string'){
            return false;
          } 

          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)){
            return false; // basic shape
          } 

          const parsed = parse(value, 'dd/MM/yyyy', new Date());
          if (!isValid(parsed)){
            return false; 
          } 

          // filter out things like 31/02/2025
          return format(parsed, 'dd/MM/yyyy') === value;
        },

        defaultMessage() {
          return 'created must be a real calendar date in the format DD/MM/YYYY';
        },
      },
    });
  };
}

export class TaskDto {
  @IsString()
  @IsNotEmpty({ message: 'id is required' })
  id!: string;

  @IsBoolean()
  complete!: boolean;

  @IsRealDDMMYYYY({ message: 'created must be a real calendar date in the format DD/MM/YYYY' })
  created!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  due!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;
}
