import { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";

export default function FooterEditor({ section, onSave, onCancel, saving }) {
  const [content, setContent] = useState({
    aboutText: section.content?.aboutText || "",
    supportEmail: section.content?.supportEmail || "",
    supportPhone: section.content?.supportPhone || "",
    address: section.content?.address || "",
    copyright: section.content?.copyright || "",
    twitterUrl: section.content?.twitterUrl || "",
    linkedinUrl: section.content?.linkedinUrl || "",
    instagramUrl: section.content?.instagramUrl || "",
  });

  const handleChange = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(content);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-theme pb-4">
        <div>
          <h3 className="text-lg font-semibold text-theme">Edit Footer & Contact Details</h3>
          <p className="text-xs text-secondary">Global platform contact info, address, social links, and copyright text.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </div>

      <Textarea
        label="About Tablly (Footer Bio)"
        rows={2}
        value={content.aboutText}
        onChange={(e) => handleChange("aboutText", e.target.value)}
        placeholder="Brief brand bio shown in the footer..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-theme">
        <Input
          label="Support Email"
          type="email"
          value={content.supportEmail}
          onChange={(e) => handleChange("supportEmail", e.target.value)}
          placeholder="support@tablly.com"
        />
        <Input
          label="Support Phone Number"
          value={content.supportPhone}
          onChange={(e) => handleChange("supportPhone", e.target.value)}
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Office Address"
          value={content.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Tech Park, Suite 400, Mumbai, India"
        />
        <Input
          label="Copyright Text"
          value={content.copyright}
          onChange={(e) => handleChange("copyright", e.target.value)}
          placeholder="© 2026 Tablly. All rights reserved."
        />
      </div>

      <div className="space-y-3 pt-2 border-t border-theme">
        <h4 className="text-sm font-medium text-theme">Social Media Profiles</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Twitter / X URL"
            value={content.twitterUrl}
            onChange={(e) => handleChange("twitterUrl", e.target.value)}
            placeholder="https://twitter.com/tablly"
          />
          <Input
            label="LinkedIn URL"
            value={content.linkedinUrl}
            onChange={(e) => handleChange("linkedinUrl", e.target.value)}
            placeholder="https://linkedin.com/company/tablly"
          />
          <Input
            label="Instagram URL"
            value={content.instagramUrl}
            onChange={(e) => handleChange("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/tablly"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-theme">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
