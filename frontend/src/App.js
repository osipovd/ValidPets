import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Settings from './components/auth/Settings';
import ChangePassword from './components/auth/ChangePassword';
import RegisterBusiness from './components/business/RegisterBusiness';
import EditBusiness from './components/business/EditBusiness';
import MyBusinesses from './components/business/MyBusinesses';
import BusinessDetails from './components/business/BusinessDetails';
import LeaveReview from './components/business/LeaveReview';
import MyReviews from './components/profile/MyReviews';
import BusinessResponseForm from './components/business/BusinessResponseForm';
import EditResponseForm from './components/business/EditResponseForm';
import LikedBusinesses from './components/profile/LikedBusinesses';
import DeleteUserAccount from './components/auth/DeleteUserAccount';
import ConfirmDeleteBusiness from './components/business/ConfirmDeleteBusiness';
import AdminDashboard from './components/admin/AdminDashboard';
import FlagReviewForm from './components/business/FlagReviewForm';
import MyCases from './components/business/MyCases';
import AdminUsers from './components/admin/AdminUsers';
import AdminBusinesses from './components/admin/AdminBusinesses';
import AdminFlaggedReviews from './components/admin/AdminFlaggedReviews';
import AdminAppeals from './components/admin/AdminAppeals';
import RespondFlag from './components/admin/RespondFlag';
import RespondAppeal from './components/admin/RespondAppeal';
import AppealForm from './components/business/AppealForm';
import { BusinessProvider } from './contexts/BusinessContext';

const App = () => {
  return (
    <BusinessProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/register-business" element={<RegisterBusiness />} />
        <Route path="/edit-business/:id" element={<EditBusiness />} />
        <Route path="/my-businesses" element={<MyBusinesses />} />
        <Route path="/business/:id" element={<BusinessDetails />} />
        <Route path="/business/:id/leave-review" element={<LeaveReview />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/business/:id/respond-review/:reviewId" element={<BusinessResponseForm />} />
        <Route path="/business/:id/edit-response/:reviewId" element={<EditResponseForm />} />
        <Route path="/liked-businesses" element={<LikedBusinesses />} />
        <Route path="/delete-account" element={<DeleteUserAccount />} />
        <Route path="/confirm-delete-business/:id" element={<ConfirmDeleteBusiness />} />
        <Route path="/flag-review/:businessId/:reviewId" element={<FlagReviewForm />} />
        <Route path="/my-cases" element={<MyCases />} />
        <Route path="/appeal/:flagId" element={<AppealForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/businesses" element={<AdminBusinesses />} />
        <Route path="/admin/flagged-reviews" element={<AdminFlaggedReviews />} />
        <Route path="/admin/appeals" element={<AdminAppeals />} />
        <Route path="/admin/respond-flag/:flagId" element={<RespondFlag />} />
        <Route path="/admin/review-appeal/:flagId" element={<RespondAppeal />} />
      </Routes>
    </BusinessProvider>
  );
};

export default App;














