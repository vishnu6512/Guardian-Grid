import commonAPI from "./commonAPI"
import serverURL from "./serverURL"
import axios from 'axios';

//register volunteer when clicked on Join as volunteer button
export const registerVolunteerAPI = async (reqBody)=>{
    return await commonAPI("POST",`${serverURL}/register`,reqBody)
}

//login volunteer when clicked on login button
export const loginVolunteerAPI = async (reqBody)=>{
    return await commonAPI("POST",`${serverURL}/login`,reqBody)
}

//affected individual request when clicked on submit request button
export const registerAfiAPI = async (reqBody)=>{
    return await commonAPI("POST",`${serverURL}/afi`,reqBody)
}

//fetch dashboard data when page loads
export const fetchDashboardDataAPI = async ()=>{
    return await commonAPI("GET",`${serverURL}/dashboard-stats`)
}

//approve volunteer when admin clicks on approve button
export const approveVolunteerAPI = async (reqBody)=>{
    return await commonAPI("POST",`${serverURL}/approve-volunteer`,reqBody)
}

//reject volunteer when admin clicks on reject button
export const rejectVolunteerAPI = async (reqBody)=>{
    return await commonAPI("POST",`${serverURL}/reject-volunteer`,reqBody)
}

//volunteer status when volunteerdashboard is loaded
export const getVolunteerStatusAPI = async (id,reqBody,reqHeader)=>{
    return await commonAPI("GET",`${serverURL}/status/${id}`,reqBody,reqHeader)
}
//assign volunteer to request
export const assignVolunteerToRequestAPI = async (reqBody) => {
    
    return await commonAPI("POST",`${serverURL}/assign-volunteer`, reqBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")
      }
    });
  };

//decline afi request when admin clicks on decline button
export const declineAfiRequestAPI = async (reqBody)=>{
    return await commonAPI("POST",`${serverURL}/decline-afi`,reqBody)
}

//get assigned afis
export const getAssignedAFIsAPI = async (id, status) => {
    return await commonAPI("GET", `${serverURL}/assigned-afis/${id}?status=${status}`);
};


//update assignment status
export const updateAssignmentStatusAPI = async (id, status) => {
    return await commonAPI("PUT", `${serverURL}/assigned-afis/${id}`, { status }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")
      }
    });
  };

//fetch nearby volunteers using google distance matrix
export const fetchNearbyVolunteersAPI = async (afiId) => {
    return await commonAPI("GET", `${serverURL}/nearby-volunteers/${afiId}`);
};





export const getNearbyEmergencyServicesAPI = async (latitude, longitude, types) => {
  return await commonAPI(
    "GET", 
    `${serverURL}/nearby-emergency-services/${latitude}/${longitude}/${types}`
  );
};





