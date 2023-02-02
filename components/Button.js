import {Button as Btn} from '@rneui/themed';

export default function Button({containerStyle, ...restProps}) {
  return (
    <Btn
      {...restProps}
      containerStyle={{
        width: 200,
        ...containerStyle,
      }}
    />
  );
}
