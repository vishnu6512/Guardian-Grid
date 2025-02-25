import commonAPI from "./commonAPI"
import serverURL from "./serverURl"
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

export const assignVolunteerToRequestAPI = async (data) => {
    return await commonAPI("POST",`${serverURL}/assign-volunteer`, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });
  };

//get assigned afis
export const getAssignedAFIsAPI = async (id)=>{
    return await commonAPI("GET",`${serverURL}/assigned-afis/${id}`)
}

