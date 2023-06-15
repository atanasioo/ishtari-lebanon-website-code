import UserSidebar from '@/components/account/UserSidebar'
import UserSidebarMobile from '@/components/account/UserSidebarMobile'
import useDeviceSize from '@/components/useDeviceSize';
import React from 'react'

function recentlyViewed() {
    const [width, height] = useDeviceSize();
  return (
    <div className="container text-dblack">
        <div>
            <div className="flex-row md:flex"></div>
            <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"addresses"} />
            ) : (
              <UserSidebarMobile active={"addresses"} />
            )}
          </div>
            </div>
        </div>
    </div>
  )
}

export default recentlyViewed