import { createSlice} from '@reduxjs/toolkit';


const listingSlice=createSlice({
    name:'listing',
    initialState:{
        allListings:[],
        selectedListing:null,
        loading:false,
    },
    reducers:{
        setListings:(state,action)=>{
            state.allListings=action.payload;
        },
        setSelectedListing:(state,action)=>{
            state.selectedListing=action.payload;
        },
        setLoading:(action,payload)=>{
            state.loading=action.payload;
        },
    },
});

export const {setListings,setSelectedListing,setLoading}=listingSlice.actions;
export default listingSlice.reducer;