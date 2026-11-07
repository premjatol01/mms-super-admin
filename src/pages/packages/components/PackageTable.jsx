import { useState, useRef, useEffect } from "react";
import { Eye, Power, Users, Layers, Calendar, Tag } from "lucide-react";

export default function PackageTable({ 
  packages, 
  loading,
  onView,
  onToggleStatus,
}) {
  const containerRef = useRef(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (!loading && packages.length === 0) {
    return (
      <div className="bg-surface border border-theme rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary-light/20 border-b border-theme">
              <tr>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-theme w-48">Package</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-32">Table Limit</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-80">Flexible Pricing (1 Mo / 6 Mos / 1 Yr)</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28">Features</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28">Status</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-32">Created</th>
                <th className="px-4 py-3.5 text-center text-sm font-medium text-theme w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-secondary">
                  No packages found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-theme rounded-xl overflow-hidden shadow-sm" ref={containerRef}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary-light/20 border-b border-theme">
            <tr>
              <th className="px-5 py-3.5 text-left text-sm font-medium text-theme w-48">Package</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-32">Table Limit</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-80">Flexible Pricing (1 Mo / 6 Mos / 1 Yr)</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28">Features</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28">Status</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-32">Created</th>
              <th className="px-4 py-3.5 text-center text-sm font-medium text-theme w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => {
              const pId = pkg._id || pkg.id;
              return (
                <tr key={pId} className="border-b border-theme hover:bg-primary-light/10 transition-colors">
                  {/* Package Name & Desc */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-theme text-base">{pkg.name}</p>
                      <p className="text-xs text-secondary truncate max-w-xs">{pkg.description}</p>
                    </div>
                  </td>

                  {/* Table Capacity Limit */}
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-primary-light/30 text-theme font-medium whitespace-nowrap">
                      <Users size={13} className="text-primary" />
                      {pkg.maxTables ? `${pkg.maxTables} Tables` : "15 Tables"}
                    </span>
                  </td>

                  {/* Multi-duration Pricing */}
                  <td className="px-4 py-4">
                    {pkg.pricing && pkg.pricing.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {pkg.pricing.map((tier) => (
                          <div
                            key={tier.duration}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${
                              tier.isPopular 
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 font-semibold"
                                : "bg-primary-light/10 border-theme text-theme font-medium"
                            }`}
                            title={`${tier.durationDisplay} (${tier.durationDays} Days): ₹${tier.price.toLocaleString()}`}
                          >
                            <span className="text-secondary text-[11px]">
                              {tier.durationDays === 30 ? "1 Mo" : tier.durationDays === 180 ? "6 Mos" : "1 Yr"}:
                            </span>
                            <span>₹{tier.price.toLocaleString()}</span>
                            {tier.isPopular && (
                              <span className="text-[9px] bg-amber-500 text-white font-bold rounded px-1 uppercase tracking-tight">
                                Best
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-theme">
                        ₹{pkg.price ? pkg.price.toLocaleString() : "Free"}
                      </span>
                    )}
                  </td>

                  {/* Features count */}
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-secondary/50 text-theme font-medium whitespace-nowrap">
                      <Layers size={12} className="text-primary" />
                      {pkg.features?.length || 0} Features
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={pkg.status} />
                  </td>

                  {/* Created */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-secondary">{formatDate(pkg.createdAt)}</span>
                  </td>

                  {/* Actions (View + Power toggle) */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => onView(pkg)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-theme hover:bg-primary-light/50 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={14} className="text-secondary" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => onToggleStatus(pkg)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          pkg.status === "active" 
                            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" 
                            : "text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                        }`}
                        title={pkg.status === "active" ? "Deactivate Package" : "Activate Package"}
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "active";
  
  return (
    <span 
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: isActive ? "#22c55e20" : "#ef444420",
        color: isActive ? "#22c55e" : "#ef4444"
      }}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
