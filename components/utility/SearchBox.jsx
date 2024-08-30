import { FontAwesome } from "@expo/vector-icons";
import React , {useRef, useState} from "react";
import { useSearchBox } from "react-instantsearch-core";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
const SearchBox=({placeholder, includeSearchButton,styleExternal, styleInternal , submittedTrigger, autoFocus,customTypingFilter})=>{
    let { query, refine } = useSearchBox();
    const [search, setSearch] = useState()
    const inputRef = useRef(null);
  
    const handleSearch = async () => {
      Keyboard.dismiss();
      if(search){
      submittedTrigger(true);
      refine(search);
      }
      else{
        submittedTrigger(false);
      }

    };
    return(
          <View className={styleExternal||"flex-row items-center mb-4"}>
            <TextInput
              className={styleInternal || "flex-1 p-2 border border-gray-300 rounded-lg"}
              placeholder={placeholder}
              ref={inputRef}
              autoFocus={autoFocus}
              value={search}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              autoComplete="off"
              onChangeText={(text)=>{
                if(customTypingFilter){
                  setSearch(customTypingFilter(text))
                }
                else{
                  setSearch(text);
                }
                }}
              onSubmitEditing={handleSearch}
            />
          {includeSearchButton ? (  <TouchableOpacity onPress={handleSearch} className="ml-2 p-2 bg-primarycolor-4 rounded-lg">
              <FontAwesome name="search" size={20} color="white" />
            </TouchableOpacity>):( <TouchableOpacity onPress={handleSearch} className="ml-2 p-2 bg-primarycolor-4 rounded-lg ">
              <FontAwesome name="search" size={18} color="white" />
            </TouchableOpacity>)}

            
          </View>
    );
  }
  export default SearchBox;
  