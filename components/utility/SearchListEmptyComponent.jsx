
import React from 'react';
import { Text} from 'react-native';

const SearchListEmptyComponent = ({ style, plugin, customText}) => {
  return(
    <>
    <Text style={{fontFamily:'Amiri'}} className={style||"text-center text-gray-500 "} >{customText|| "No results found"}</Text>
    {plugin}
    </>
  );
};

export default SearchListEmptyComponent;
