'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, Copy, Check } from 'lucide-react';
import { showToast } from '@/lib/showToast';
import { useRouter } from 'next/navigation';
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute';
import ButtonLoading from '@/components/ButtonLoading';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  referralCode: string;
  points: number;
  referredBy?: {
    id: string;
    email: string;
    name: string;
    referralCode: string;
  } | null;
}

interface Referral {
  id: string;
  email: string;
  name: string;
  referralCode: string;
  createdAt: string;
}

interface DashboardData {
  user: User;
  stats: {
    totalReferrals: number;
    totalPoints: number;
  };
  referrals: Referral[];
}

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
        {
          withCredentials: true
        }
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      setData(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push(WEBSITE_LOGIN);
        return;
      }
      showToast('error', error.response?.data?.message || 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!data?.user.referralCode) return;
    
    navigator.clipboard.writeText(data.user.referralCode);
    setCopied(true);
    showToast('success', 'Referral code copied!');
    
    setTimeout(() => setCopied(false), 3000);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {},
        {
          withCredentials: true
        }
      );
      
      router.push(WEBSITE_LOGIN);
      showToast('success', 'Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      showToast('error', error.response?.data?.message || 'Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const { user, stats, referrals } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! 👋
          </p>
        </div>
        <ButtonLoading
          className="bg-red-500 hover:bg-red-600 cursor-pointer"
          loading={false}
          type="button"
          text="Logout"
          variant="default"
          onClick={handleLogout}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.points}</div>
            <p className="text-xs text-muted-foreground">
              Points earned from referrals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              People you've referred
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
            <button
              onClick={handleCopyCode}
              className="p-1 hover:bg-muted rounded-md transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-primary">
              {user.referralCode}
            </div>
            <p className="text-xs text-muted-foreground">
              Share this code with friends!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referred By */}
      {user.referredBy && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Referred By</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You were referred by{' '}
              <span className="font-semibold">{user.referredBy.name}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Their referral code: {user.referredBy.referralCode}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <p className="text-sm text-muted-foreground">
            People who signed up using your referral code
          </p>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              You haven't referred anyone yet. Share your referral code!
            </p>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {referral.email}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;