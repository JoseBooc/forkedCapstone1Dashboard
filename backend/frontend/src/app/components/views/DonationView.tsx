import { useState, useEffect } from 'react';
import { 
  Heart, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  Microscope, 
  Globe, 
  BookOpen, 
  Presentation,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Gift,
  Award,
  Calendar,
  Trash2,
  CreditCard,
  X,
  Settings,
  Plus,
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { Footer } from '../Footer';

interface DonationsViewProps {
  userRole?: "alumni" | "admin";
  onNavigate?: (view: string) => void;
}

interface Campaign {
  id: number;
  title: string;
  goal: string;
  raised: string;
  backers: number;
  status: string;
  is_active?: boolean;
}

interface GivebackProject {
  id: number;
  title: string;
  description: string;
  collaboration?: string | null;
  target_amount: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image_url?: string | null;
  is_archived: boolean;
}

interface GivebackProjectEvent {
  id: number;
  project_id: number;
  title: string;
  description: string;
  location?: string | null;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image_url?: string | null;
  is_archived: boolean;
}

interface GivebackProgram {
  id: number;
  type: 'scholarship' | 'donation' | 'community_support';
  title: string;
  description: string;
  beneficiary: string;
  funding_goal: number;
  amount_raised: number;
  donor_count: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  is_archived: boolean;
  progress_percentage?: number;
}

export function DonationsView({ userRole, onNavigate }: DonationsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'gift' | 'needs'>('gift');
  const [managementView, setManagementView] = useState(false);
  const [adminManagementView, setAdminManagementView] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);
  
  // States for the Modal
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [isChangingPayment, setIsChangingPayment] = useState(false);
  
  // Dynamic State for the Recurring Gift
  const [recurringAmount, setRecurringAmount] = useState("₱500");
  const [tempAmount, setTempAmount] = useState("");
  
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedFreq, setSelectedFreq] = useState<string | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<string | null>(null);
  
  // Default and selectable payment state
  const [selectedPayment, setSelectedPayment] = useState<string>("Credit Card");

  // Campaigns State - Fetch from API
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [adminSection, setAdminSection] = useState<'campaigns' | 'projects' | 'projectEvents' | 'programs'>('campaigns');
  const [projects, setProjects] = useState<GivebackProject[]>([]);
  const [projectEvents, setProjectEvents] = useState<GivebackProjectEvent[]>([]);
  const [programs, setPrograms] = useState<GivebackProgram[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProjectEvents, setLoadingProjectEvents] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    collaboration: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    status: 'upcoming'
  });
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const [projectEventForm, setProjectEventForm] = useState({
    projectId: '',
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'upcoming'
  });
  const [projectEventImage, setProjectEventImage] = useState<File | null>(null);
  const [editingProjectEventId, setEditingProjectEventId] = useState<number | null>(null);

  const [programForm, setProgramForm] = useState({
    type: 'scholarship',
    title: '',
    description: '',
    beneficiary: '',
    fundingGoal: '',
    amountRaised: '0',
    donorCount: '0',
    status: 'ongoing'
  });
  const [editingProgramId, setEditingProgramId] = useState<number | null>(null);
  
  // Donation to Campaign States
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationFirstName, setDonationFirstName] = useState('');
  const [donationLastName, setDonationLastName] = useState('');
  const [donationEmail, setDonationEmail] = useState('');
  const [donationPaymentMethod, setDonationPaymentMethod] = useState('Credit Card');
  const [isDonating, setIsDonating] = useState(false);

  // Form States for New Campaign
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    category: 'Student Aid',
    imageUrl: '',
    goalAmount: '',
    endDate: ''
  });

  const [editCampaignData, setEditCampaignData] = useState({
    title: '',
    description: '',
    category: 'Student Aid',
    imageUrl: '',
    goalAmount: '',
    endDate: ''
  });

  // Fetch campaigns from API
  useEffect(() => {
    fetchCampaigns();
    fetchProjects();
    fetchProjectEvents();
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const fetchCampaigns = async () => {
    try {
      // Admins see all campaigns, users only see active ones
      const roleParam = userRole === 'admin' ? '?role=admin' : '';
      const response = await fetch(`http://localhost:8000/api/campaigns${roleParam}`);
      if (response.ok) {
        const data = await response.json();
        const formattedCampaigns = data.map((campaign: any) => ({
          id: campaign.id,
          title: campaign.title,
          goal: `₱${Number(campaign.goal_amount).toLocaleString()}`,
          raised: `₱${Number(campaign.raised_amount || 0).toLocaleString()}`,
          backers: campaign.donors_count || 0,
          status: campaign.is_active ? 'Active' : 'Inactive',
          is_active: campaign.is_active,
          ...campaign // Include all original fields
        }));
        setCampaigns(formattedCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch('http://localhost:8000/api/giveback/projects?include_archived=true');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchProjectEvents = async () => {
    setLoadingProjectEvents(true);
    try {
      const response = await fetch('http://localhost:8000/api/giveback/project-events?include_archived=true');
      if (response.ok) {
        const data = await response.json();
        setProjectEvents(data);
      }
    } catch (error) {
      console.error('Error fetching project events:', error);
    } finally {
      setLoadingProjectEvents(false);
    }
  };

  const fetchPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const response = await fetch('http://localhost:8000/api/giveback/programs?include_archived=true');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const activeGifts = [
    { id: 1, amount: recurringAmount, freq: "Monthly", designation: "Student Financial Aid", nextDate: "March 15, 2026" }
  ];

  const handleToggle = (current: string | null, clicked: string, setter: (val: string | null) => void) => {
    setter(current === clicked ? null : clicked);
  };

  const confirmNewAmount = () => {
    if (tempAmount) {
      setRecurringAmount(`₱${tempAmount}`);
    } else if (selectedAmount) {
      setRecurringAmount(selectedAmount);
    }
    setIsEditingAmount(false);
    setTempAmount("");
    setSelectedAmount(null);
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.title || !newCampaign.goalAmount || !newCampaign.endDate) {
      alert("Please fill in all required fields (Title, Goal Amount, and End Date).");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newCampaign.title,
          description: newCampaign.description || 'No description provided',
          category: newCampaign.category,
          goal_amount: parseFloat(newCampaign.goalAmount),
          end_date: newCampaign.endDate,
          image_url: newCampaign.imageUrl || null,
          is_active: true
        })
      });

      if (response.ok) {
        await response.json();
        fetchCampaigns(); // Refresh the campaigns list
        setIsCreatingCampaign(false);
        setNewCampaign({
          title: '',
          description: '',
          category: 'Student Aid',
          imageUrl: '',
          goalAmount: '',
          endDate: ''
        });
        alert("Campaign created successfully!");
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(`Failed to create campaign: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert(`Error creating campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditCampaign = async () => {
    if (!editCampaignData.title || !editCampaignData.goalAmount) {
      alert("Please fill in the required fields.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/campaigns/${editingCampaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editCampaignData.title,
          description: editCampaignData.description || 'No description provided',
          category: editCampaignData.category,
          goal_amount: parseFloat(editCampaignData.goalAmount),
          end_date: editCampaignData.endDate || new Date().toISOString().split('T')[0],
          image_url: editCampaignData.imageUrl || null
        })
      });

      if (response.ok) {
        fetchCampaigns(); // Refresh the campaigns list
        setIsEditingCampaign(false);
        setEditingCampaignId(null);
        setEditCampaignData({
          title: '',
          description: '',
          category: 'Student Aid',
          imageUrl: '',
          goalAmount: '',
          endDate: ''
        });
        alert("Campaign updated successfully!");
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(`Failed to update campaign: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert(`Error updating campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/campaigns/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCampaigns(); // Refresh the campaigns list
        alert("Campaign deleted successfully!");
      } else {
        alert("Failed to delete campaign");
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert("Error deleting campaign");
    }
  };

  const handleToggleCampaignVisibility = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:8000/api/campaigns/${id}/toggle-active`, {
        method: 'PATCH'
      });

      if (response.ok) {
        fetchCampaigns(); // Refresh the campaigns list
        alert(currentStatus ? "Campaign hidden successfully!" : "Campaign shown successfully!");
      } else {
        alert("Failed to update campaign visibility");
      }
    } catch (error) {
      console.error('Error toggling campaign visibility:', error);
      alert("Error updating campaign visibility");
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      collaboration: '',
      targetAmount: '',
      startDate: '',
      endDate: '',
      status: 'upcoming'
    });
    setProjectImage(null);
    setEditingProjectId(null);
  };

  const handleCreateProject = async () => {
    if (!projectForm.title || !projectForm.description || !projectForm.targetAmount || !projectForm.startDate || !projectForm.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('collaboration', projectForm.collaboration);
    formData.append('target_amount', projectForm.targetAmount);
    formData.append('start_date', projectForm.startDate);
    formData.append('end_date', projectForm.endDate);
    formData.append('status', projectForm.status);
    if (projectImage) {
      formData.append('image', projectImage);
    }

    try {
      const response = await fetch('http://localhost:8000/api/giveback/projects', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        await fetchProjects();
        resetProjectForm();
        alert('Project created successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const openEditProject = (project: GivebackProject) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      description: project.description,
      collaboration: project.collaboration || '',
      targetAmount: String(project.target_amount),
      startDate: project.start_date,
      endDate: project.end_date,
      status: project.status
    });
    setProjectImage(null);
  };

  const handleUpdateProject = async () => {
    if (!editingProjectId) return;
    if (!projectForm.title || !projectForm.description || !projectForm.targetAmount || !projectForm.startDate || !projectForm.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('collaboration', projectForm.collaboration);
    formData.append('target_amount', projectForm.targetAmount);
    formData.append('start_date', projectForm.startDate);
    formData.append('end_date', projectForm.endDate);
    formData.append('status', projectForm.status);
    if (projectImage) {
      formData.append('image', projectImage);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/giveback/projects/${editingProjectId}`, {
        method: 'PUT',
        body: formData
      });
      if (response.ok) {
        await fetchProjects();
        resetProjectForm();
        alert('Project updated successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/projects/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleArchiveProject = async (id: number) => {
    if (!window.confirm('Archive this project?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/projects/${id}/archive`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchProjects();
        alert('Project archived successfully');
      }
    } catch (error) {
      console.error('Error archiving project:', error);
      alert('Failed to archive project');
    }
  };

  const handleRestoreProject = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/projects/${id}/restore`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchProjects();
        alert('Project restored successfully');
      }
    } catch (error) {
      console.error('Error restoring project:', error);
      alert('Failed to restore project');
    }
  };

  const resetProjectEventForm = () => {
    setProjectEventForm({
      projectId: '',
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      status: 'upcoming'
    });
    setProjectEventImage(null);
    setEditingProjectEventId(null);
  };

  const handleCreateProjectEvent = async () => {
    if (!projectEventForm.projectId || !projectEventForm.title || !projectEventForm.description || !projectEventForm.startDate || !projectEventForm.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('project_id', projectEventForm.projectId);
    formData.append('title', projectEventForm.title);
    formData.append('description', projectEventForm.description);
    formData.append('location', projectEventForm.location);
    formData.append('start_date', projectEventForm.startDate);
    formData.append('end_date', projectEventForm.endDate);
    formData.append('status', projectEventForm.status);
    if (projectEventImage) {
      formData.append('image', projectEventImage);
    }

    try {
      const response = await fetch('http://localhost:8000/api/giveback/project-events', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        await fetchProjectEvents();
        resetProjectEventForm();
        alert('Project event created successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to create project event');
      }
    } catch (error) {
      console.error('Error creating project event:', error);
      alert('Failed to create project event');
    }
  };

  const openEditProjectEvent = (projectEvent: GivebackProjectEvent) => {
    setEditingProjectEventId(projectEvent.id);
    setProjectEventForm({
      projectId: String(projectEvent.project_id),
      title: projectEvent.title,
      description: projectEvent.description,
      location: projectEvent.location || '',
      startDate: projectEvent.start_date,
      endDate: projectEvent.end_date,
      status: projectEvent.status
    });
  };

  const handleUpdateProjectEvent = async () => {
    if (!editingProjectEventId) return;
    if (!projectEventForm.projectId || !projectEventForm.title || !projectEventForm.description || !projectEventForm.startDate || !projectEventForm.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('project_id', projectEventForm.projectId);
    formData.append('title', projectEventForm.title);
    formData.append('description', projectEventForm.description);
    formData.append('location', projectEventForm.location);
    formData.append('start_date', projectEventForm.startDate);
    formData.append('end_date', projectEventForm.endDate);
    formData.append('status', projectEventForm.status);
    if (projectEventImage) {
      formData.append('image', projectEventImage);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/giveback/project-events/${editingProjectEventId}`, {
        method: 'PUT',
        body: formData
      });
      if (response.ok) {
        await fetchProjectEvents();
        resetProjectEventForm();
        alert('Project event updated successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update project event');
      }
    } catch (error) {
      console.error('Error updating project event:', error);
      alert('Failed to update project event');
    }
  };

  const handleDeleteProjectEvent = async (id: number) => {
    if (!window.confirm('Delete this project event?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/project-events/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchProjectEvents();
      }
    } catch (error) {
      console.error('Error deleting project event:', error);
    }
  };

  const handleArchiveProjectEvent = async (id: number) => {
    if (!window.confirm('Archive this event?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/project-events/${id}/archive`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchProjectEvents();
        alert('Event archived successfully');
      }
    } catch (error) {
      console.error('Error archiving project event:', error);
      alert('Failed to archive event');
    }
  };

  const handleRestoreProjectEvent = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/project-events/${id}/restore`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchProjectEvents();
        alert('Event restored successfully');
      }
    } catch (error) {
      console.error('Error restoring project event:', error);
      alert('Failed to restore event');
    }
  };

  const resetProgramForm = () => {
    setProgramForm({
      type: 'scholarship',
      title: '',
      description: '',
      beneficiary: '',
      fundingGoal: '',
      amountRaised: '0',
      donorCount: '0',
      status: 'ongoing'
    });
    setEditingProgramId(null);
  };

  const handleCreateProgram = async () => {
    if (!programForm.title || !programForm.description || !programForm.beneficiary || !programForm.fundingGoal) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/giveback/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: programForm.type,
          title: programForm.title,
          description: programForm.description,
          beneficiary: programForm.beneficiary,
          funding_goal: Number(programForm.fundingGoal),
          amount_raised: Number(programForm.amountRaised),
          donor_count: Number(programForm.donorCount),
          status: programForm.status
        })
      });

      if (response.ok) {
        await fetchPrograms();
        resetProgramForm();
        alert('Program created successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to create program');
      }
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Failed to create program');
    }
  };

  const openEditProgram = (program: GivebackProgram) => {
    setEditingProgramId(program.id);
    setProgramForm({
      type: program.type,
      title: program.title,
      description: program.description,
      beneficiary: program.beneficiary,
      fundingGoal: String(program.funding_goal),
      amountRaised: String(program.amount_raised),
      donorCount: String(program.donor_count),
      status: program.status
    });
  };

  const handleUpdateProgram = async () => {
    if (!editingProgramId) return;
    if (!programForm.title || !programForm.description || !programForm.beneficiary || !programForm.fundingGoal) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/giveback/programs/${editingProgramId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: programForm.type,
          title: programForm.title,
          description: programForm.description,
          beneficiary: programForm.beneficiary,
          funding_goal: Number(programForm.fundingGoal),
          amount_raised: Number(programForm.amountRaised),
          donor_count: Number(programForm.donorCount),
          status: programForm.status
        })
      });

      if (response.ok) {
        await fetchPrograms();
        resetProgramForm();
        alert('Program updated successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update program');
      }
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Failed to update program');
    }
  };

  const handleDeleteProgram = async (id: number) => {
    if (!window.confirm('Delete this program?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/programs/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchPrograms();
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const handleArchiveProgram = async (id: number) => {
    if (!window.confirm('Archive this program?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/programs/${id}/archive`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchPrograms();
        alert('Program archived successfully');
      }
    } catch (error) {
      console.error('Error archiving program:', error);
      alert('Failed to archive program');
    }
  };

  const handleRestoreProgram = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/giveback/programs/${id}/restore`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchPrograms();
        alert('Program restored successfully');
      }
    } catch (error) {
      console.error('Error restoring program:', error);
      alert('Failed to restore program');
    }
  };

  const openEditCampaign = (campaign: Campaign) => {
    setEditingCampaignId(campaign.id);
    setEditCampaignData({
      title: campaign.title,
      description: '',
      category: 'Student Aid',
      imageUrl: '',
      goalAmount: campaign.goal.replace(/\D/g, ''),
      endDate: ''
    });
    setIsEditingCampaign(true);
  };

  const openDonationModal = (campaign: Campaign) => {
    setSelectedCampaignForDonation(campaign);
    setShowDonationModal(true);
  };

  const handleDonateToCampaign = async () => {
    if (!donationAmount || !donationFirstName || !donationLastName || !donationEmail) {
      alert("Please fill in all required fields");
      return;
    }

    if (!selectedCampaignForDonation) {
      alert("No campaign selected");
      return;
    }

    setIsDonating(true);
    try {
      const response = await fetch(`http://localhost:8000/api/campaigns/${selectedCampaignForDonation.id}/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(donationAmount),
          first_name: donationFirstName,
          last_name: donationLastName,
          email: donationEmail,
          payment_method: donationPaymentMethod
        })
      });

      if (response.ok) {
        alert("Thank you for your donation!");
        setShowDonationModal(false);
        setDonationAmount('');
        setDonationFirstName('');
        setDonationLastName('');
        setDonationEmail('');
        setDonationPaymentMethod('Credit Card');
        setSelectedCampaignForDonation(null);
        fetchCampaigns(); // Refresh campaigns to update amounts
      } else {
        const errorData = await response.json();
        alert(`Failed to process donation: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      alert(`Error processing donation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDonating(false);
    }
  };

  if (showForm) {
    // Prevent non-admins from accessing admin management view
    if (userRole !== 'admin' && adminManagementView) {
      setAdminManagementView(false);
    }

    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => {
                if (isCreatingCampaign) setIsCreatingCampaign(false);
                else if (isEditingCampaign) setIsEditingCampaign(false);
                else if (adminManagementView) setAdminManagementView(false);
                else if (managementView) setManagementView(false);
                else {
                  setShowForm(false);
                  // If admin and in form, return to homepage
                  if (userRole === 'admin' && onNavigate) {
                    onNavigate('home');
                  }
                }
              }} 
              className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#003087] transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> 
              {isCreatingCampaign ? "Back to Campaign List" : isEditingCampaign ? "Back to Campaign List" : adminManagementView ? "Back to Donation Form" : managementView ? "Back to Donation Form" : "Back to Information"}
            </button>
            
            <div className="bg-white rounded-[40px] shadow-xl p-12 text-left space-y-12 border border-gray-100 relative">
              
              {/* UPDATE AMOUNT IN-SECTION MODAL */}
              {isEditingAmount && (
                <div className="absolute inset-0 z-50 bg-white rounded-[40px] p-12 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">Update Gift Amount</h3>
                    <button onClick={() => setIsEditingAmount(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {['₱500', '₱1,000', '₱2,000', '₱5,000'].map((amt) => (
                        <button 
                          key={amt} 
                          onClick={() => {
                            setSelectedAmount(amt);
                            setTempAmount("");
                          }} 
                          className={`py-4 rounded-2xl font-bold border-2 transition-all ${selectedAmount === amt ? 'bg-[#003087] border-[#003087] text-white' : 'border-gray-100'}`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Custom Amount" 
                      value={tempAmount}
                      onChange={(e) => {
                        setTempAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" 
                    />
                    <button 
                      onClick={confirmNewAmount} 
                      className="w-full py-4 bg-[#003087] text-white rounded-xl font-bold"
                    >
                      Confirm New Amount
                    </button>
                  </div>
                </div>
              )}

              {/* CHANGE PAYMENT IN-SECTION MODAL */}
              {isChangingPayment && (
                <div className="absolute inset-0 z-50 bg-white rounded-[40px] p-12 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">Change Payment Method</h3>
                    <button onClick={() => setIsChangingPayment(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
                  </div>
                  <div className="space-y-6">
                    {['Credit Card', 'GCash', 'Bank Transfer'].map(m => (
                      <button key={m} onClick={() => setSelectedPayment(m)} className={`w-full p-6 border-2 rounded-2xl flex justify-between items-center font-bold transition-all ${selectedPayment === m ? 'border-[#003087] bg-blue-50' : 'border-gray-100'}`}>
                        {m}
                        {selectedPayment === m && <CheckCircle2 className="text-[#003087]" />}
                      </button>
                    ))}
                    <button onClick={() => setIsChangingPayment(false)} className="w-full py-4 bg-[#003087] text-white rounded-xl font-bold">Save Payment Method</button>
                  </div>
                </div>
              )}

              {isCreatingCampaign ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Create New Campaign</h1>
                    <p className="text-gray-500">Fill in the details to launch a new fundraising initiative.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Campaign Title *</label>
                        <input 
                          type="text" 
                          value={newCampaign.title}
                          onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                          placeholder="e.g., Scholar Excellence Fund 2026" 
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Description *</label>
                        <textarea 
                          value={newCampaign.description}
                          onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                          placeholder="Tell the story of this campaign..." 
                          rows={4} 
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all resize-none" 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Category</label>
                          <select 
                            value={newCampaign.category}
                            onChange={(e) => setNewCampaign({...newCampaign, category: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all appearance-none"
                          >
                            <option>Student Aid</option>
                            <option>Infrastructure</option>
                            <option>Research</option>
                            <option>Faculty</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Image URL (Optional)</label>
                          <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              type="text" 
                              value={newCampaign.imageUrl}
                              onChange={(e) => setNewCampaign({...newCampaign, imageUrl: e.target.value})}
                              placeholder="https://..." 
                              className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Upload Campaign Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer transition-all">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="text-sm font-bold text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400">PNG, JPG or WEBP (max. 5MB)</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Goal Amount (₱) *</label>
                          <input 
                            type="number" 
                            value={newCampaign.goalAmount}
                            onChange={(e) => setNewCampaign({...newCampaign, goalAmount: e.target.value})}
                            placeholder="0.00" 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">End Date *</label>
                          <input 
                            type="date" 
                            value={newCampaign.endDate}
                            onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-8">
                      <button onClick={() => setIsCreatingCampaign(false)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                      <button onClick={handleCreateCampaign} className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all">Create Campaign</button>
                    </div>
                  </div>
                </div>
              ) : isEditingCampaign ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Edit Campaign</h1>
                    <p className="text-gray-500">Update the details of your fundraising campaign.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Campaign Title *</label>
                        <input 
                          type="text" 
                          value={editCampaignData.title}
                          onChange={(e) => setEditCampaignData({...editCampaignData, title: e.target.value})}
                          placeholder="e.g., Scholar Excellence Fund 2026" 
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Description *</label>
                        <textarea 
                          value={editCampaignData.description}
                          onChange={(e) => setEditCampaignData({...editCampaignData, description: e.target.value})}
                          placeholder="Tell the story of this campaign..." 
                          rows={4} 
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all resize-none" 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Category</label>
                          <select 
                            value={editCampaignData.category}
                            onChange={(e) => setEditCampaignData({...editCampaignData, category: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all appearance-none"
                          >
                            <option>Student Aid</option>
                            <option>Infrastructure</option>
                            <option>Research</option>
                            <option>Faculty</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Image URL (Optional)</label>
                          <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              type="text" 
                              value={editCampaignData.imageUrl}
                              onChange={(e) => setEditCampaignData({...editCampaignData, imageUrl: e.target.value})}
                              placeholder="https://..." 
                              className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Goal Amount (₱) *</label>
                          <input 
                            type="number" 
                            value={editCampaignData.goalAmount}
                            onChange={(e) => setEditCampaignData({...editCampaignData, goalAmount: e.target.value})}
                            placeholder="0.00" 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">End Date *</label>
                          <input 
                            type="date" 
                            value={editCampaignData.endDate}
                            onChange={(e) => setEditCampaignData({...editCampaignData, endDate: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#003087] transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-8">
                      <button onClick={() => setIsEditingCampaign(false)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                      <button onClick={handleEditCampaign} className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all">Update Campaign</button>
                    </div>
                  </div>
                </div>
              ) : adminManagementView ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col gap-6 border-b border-gray-100 pb-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900">GiveBack Management</h1>
                        <p className="text-gray-500">Maintain campaigns, projects, events, and programs.</p>
                      </div>
                      {adminSection === 'campaigns' && (
                        <button 
                          onClick={() => setIsCreatingCampaign(true)}
                          className="flex items-center gap-2 px-6 py-3 bg-[#003087] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-blue-800 transition-all"
                        >
                          <Plus className="w-4 h-4" /> New Campaign
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { key: 'campaigns', label: 'Campaigns' },
                        { key: 'projects', label: 'Projects' },
                        { key: 'projectEvents', label: 'Project Events' },
                        { key: 'programs', label: 'GiveBack Programs' }
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setAdminSection(item.key as any)}
                          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${adminSection === item.key ? 'bg-[#003087] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {adminSection === 'campaigns' && (
                    <div className="grid grid-cols-1 gap-6">
                      {loading ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 font-semibold">Loading campaigns...</p>
                        </div>
                      ) : campaigns.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 font-semibold">No campaigns created yet</p>
                        </div>
                      ) : (
                        campaigns.map((campaign) => (
                          <div key={campaign.id} className="p-6 border border-gray-200 rounded-3xl space-y-4 hover:border-blue-300 transition-all group">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xl font-bold text-gray-900">{campaign.title}</h4>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${campaign.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {campaign.is_active ? 'Active' : 'Hidden'}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Progress</span>
                                <span className="font-bold text-[#003087]">{campaign.raised} / {campaign.goal}</span>
                              </div>
                              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#003087] rounded-full transition-all duration-1000" 
                                  style={{ width: `${(parseInt(campaign.raised.replace(/\D/g,'')) || 0) / (parseInt(campaign.goal.replace(/\D/g,'')) || 1) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                              <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                <span>{campaign.backers} Backers</span>
                                <span>Ends in 14 days</span>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => openEditCampaign(campaign)}
                                  className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#003087] transition-all"
                                  title="Edit campaign"
                                >
                                  <Settings className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleToggleCampaignVisibility(campaign.id, campaign.is_active || false)}
                                  className="p-2 hover:bg-yellow-50 rounded-lg text-gray-400 hover:text-yellow-600 transition-all"
                                  title={campaign.is_active ? "Hide campaign" : "Show campaign"}
                                >
                                  {campaign.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                                <button 
                                  onClick={() => handleDeleteCampaign(campaign.id)}
                                  className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                                  title="Delete campaign"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {adminSection === 'projects' && (
                    <div className="space-y-8">
                      <div className="bg-white border border-gray-200 rounded-3xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {editingProjectId ? 'Edit Project' : 'Create Project'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-bold text-gray-700">Title *</label>
                            <input
                              type="text"
                              value={projectForm.title}
                              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Collaboration (OSMQA)</label>
                            <input
                              type="text"
                              value={projectForm.collaboration}
                              onChange={(e) => setProjectForm({ ...projectForm, collaboration: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Description *</label>
                            <textarea
                              rows={3}
                              value={projectForm.description}
                              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Target Amount *</label>
                            <input
                              type="number"
                              value={projectForm.targetAmount}
                              onChange={(e) => setProjectForm({ ...projectForm, targetAmount: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Status *</label>
                            <select
                              value={projectForm.status}
                              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="ongoing">Ongoing</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Start Date *</label>
                            <input
                              type="date"
                              value={projectForm.startDate}
                              onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">End Date *</label>
                            <input
                              type="date"
                              value={projectForm.endDate}
                              onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Project Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setProjectImage(e.target.files?.[0] || null)}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={editingProjectId ? handleUpdateProject : handleCreateProject}
                            className="px-6 py-3 bg-[#003087] text-white rounded-xl font-bold"
                          >
                            {editingProjectId ? 'Update Project' : 'Create Project'}
                          </button>
                          <button
                            onClick={resetProjectForm}
                            className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {loadingProjects ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 font-semibold">Loading projects...</p>
                          </div>
                        ) : projects.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 font-semibold">No projects created yet</p>
                          </div>
                        ) : (
                          projects.filter((project) => !project.is_archived).map((project) => (
                            <div key={project.id} className="p-6 border border-gray-200 rounded-3xl space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xl font-bold text-gray-900">{project.title}</h4>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                                  {project.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">{project.description}</p>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Target: ₱{Number(project.target_amount).toLocaleString()}</span>
                                <span>{project.start_date} - {project.end_date}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditProject(project)}
                                  className="px-3 py-2 text-sm font-bold text-[#003087] bg-blue-50 rounded-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleArchiveProject(project.id)}
                                  className="px-3 py-2 text-sm font-bold text-yellow-700 bg-yellow-50 rounded-lg"
                                >
                                  Archive
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="px-3 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {projects.filter((project) => project.is_archived).length > 0 && (
                        <div className="grid grid-cols-1 gap-6 pt-4">
                          <div className="text-sm font-bold text-gray-700">Archived Projects</div>
                          {projects.filter((project) => project.is_archived).map((project) => (
                            <div key={`archived-${project.id}`} className="p-6 border border-gray-200 rounded-3xl space-y-4 bg-gray-50">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xl font-bold text-gray-900">{project.title}</h4>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">Archived</span>
                              </div>
                              <p className="text-sm text-gray-500">{project.description}</p>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Target: ₱{Number(project.target_amount).toLocaleString()}</span>
                                <span>{project.start_date} - {project.end_date}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRestoreProject(project.id)}
                                  className="px-3 py-2 text-sm font-bold text-[#003087] bg-blue-50 rounded-lg"
                                >
                                  Restore
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {adminSection === 'projectEvents' && (
                    <div className="space-y-8">
                      <div className="bg-white border border-gray-200 rounded-3xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {editingProjectEventId ? 'Edit Project Event' : 'Create Project Event'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-bold text-gray-700">Project *</label>
                            <select
                              value={projectEventForm.projectId}
                              onChange={(e) => setProjectEventForm({ ...projectEventForm, projectId: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            >
                              <option value="">Select project</option>
                              {projects.filter((project) => !project.is_archived).map((project) => (
                                <option key={project.id} value={project.id}>{project.title}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Title *</label>
                            <input
                              type="text"
                              value={projectEventForm.title}
                              onChange={(e) => setProjectEventForm({ ...projectEventForm, title: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Description *</label>
                            <textarea
                              rows={3}
                              value={projectEventForm.description}
                              onChange={(e) => setProjectEventForm({ ...projectEventForm, description: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Location</label>
                            <input
                              type="text"
                              value={projectEventForm.location}
                              onChange={(e) => setProjectEventForm({ ...projectEventForm, location: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Status *</label>
                            <select
                              value={projectEventForm.status}
                              onChange={(e) => setProjectEventForm({ ...projectEventForm, status: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="ongoing">Ongoing</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Start Date *</label>
                            <input
                              type="date"
                              value={projectEventForm.startDate}
                              onChange={(e) => setProjectEventForm({ ...projectEventForm, startDate: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">End Date *</label>
                            <input
                              type="date"
                              value={projectEventForm.endDate}
                              onChange={(e) => setProjectEventForm({ ...projectEventForm, endDate: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Event Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setProjectEventImage(e.target.files?.[0] || null)}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={editingProjectEventId ? handleUpdateProjectEvent : handleCreateProjectEvent}
                            className="px-6 py-3 bg-[#003087] text-white rounded-xl font-bold"
                          >
                            {editingProjectEventId ? 'Update Event' : 'Create Event'}
                          </button>
                          <button
                            onClick={resetProjectEventForm}
                            className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {loadingProjectEvents ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 font-semibold">Loading project events...</p>
                          </div>
                        ) : projectEvents.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 font-semibold">No project events created yet</p>
                          </div>
                        ) : (
                          projectEvents.filter((event) => !event.is_archived).map((event) => (
                            <div key={event.id} className="p-6 border border-gray-200 rounded-3xl space-y-3">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xl font-bold text-gray-900">{event.title}</h4>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                                  {event.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">{event.description}</p>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>{event.start_date} - {event.end_date}</span>
                                <span>{event.location || 'TBD'}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditProjectEvent(event)}
                                  className="px-3 py-2 text-sm font-bold text-[#003087] bg-blue-50 rounded-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleArchiveProjectEvent(event.id)}
                                  className="px-3 py-2 text-sm font-bold text-yellow-700 bg-yellow-50 rounded-lg"
                                >
                                  Archive
                                </button>
                                <button
                                  onClick={() => handleDeleteProjectEvent(event.id)}
                                  className="px-3 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {projectEvents.filter((event) => event.is_archived).length > 0 && (
                        <div className="grid grid-cols-1 gap-6 pt-4">
                          <div className="text-sm font-bold text-gray-700">Archived Project Events</div>
                          {projectEvents.filter((event) => event.is_archived).map((event) => (
                            <div key={`archived-${event.id}`} className="p-6 border border-gray-200 rounded-3xl space-y-4 bg-gray-50">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xl font-bold text-gray-900">{event.title}</h4>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">Archived</span>
                              </div>
                              <p className="text-sm text-gray-500">{event.description}</p>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>{event.start_date} - {event.end_date}</span>
                                <span>{event.location || 'TBD'}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRestoreProjectEvent(event.id)}
                                  className="px-3 py-2 text-sm font-bold text-[#003087] bg-blue-50 rounded-lg"
                                >
                                  Restore
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {adminSection === 'programs' && (
                    <div className="space-y-8">
                      <div className="bg-white border border-gray-200 rounded-3xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {editingProgramId ? 'Edit Program' : 'Create Program'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-bold text-gray-700">Type *</label>
                            <select
                              value={programForm.type}
                              onChange={(e) => setProgramForm({ ...programForm, type: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            >
                              <option value="scholarship">Scholarship</option>
                              <option value="donation">Donation</option>
                              <option value="community_support">Community Support</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Title *</label>
                            <input
                              type="text"
                              value={programForm.title}
                              onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Description *</label>
                            <textarea
                              rows={3}
                              value={programForm.description}
                              onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Beneficiary *</label>
                            <input
                              type="text"
                              value={programForm.beneficiary}
                              onChange={(e) => setProgramForm({ ...programForm, beneficiary: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Funding Goal *</label>
                            <input
                              type="number"
                              value={programForm.fundingGoal}
                              onChange={(e) => setProgramForm({ ...programForm, fundingGoal: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Amount Raised</label>
                            <input
                              type="number"
                              value={programForm.amountRaised}
                              onChange={(e) => setProgramForm({ ...programForm, amountRaised: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Donor Count</label>
                            <input
                              type="number"
                              value={programForm.donorCount}
                              onChange={(e) => setProgramForm({ ...programForm, donorCount: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-700">Status *</label>
                            <select
                              value={programForm.status}
                              onChange={(e) => setProgramForm({ ...programForm, status: e.target.value })}
                              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 rounded-xl"
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="ongoing">Ongoing</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={editingProgramId ? handleUpdateProgram : handleCreateProgram}
                            className="px-6 py-3 bg-[#003087] text-white rounded-xl font-bold"
                          >
                            {editingProgramId ? 'Update Program' : 'Create Program'}
                          </button>
                          <button
                            onClick={resetProgramForm}
                            className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {loadingPrograms ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 font-semibold">Loading programs...</p>
                          </div>
                        ) : programs.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 font-semibold">No programs created yet</p>
                          </div>
                        ) : (
                          programs.filter((program) => !program.is_archived).map((program) => (
                            <div key={program.id} className="p-6 border border-gray-200 rounded-3xl space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xl font-bold text-gray-900">{program.title}</h4>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                                  {program.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">{program.description}</p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500 font-medium">Progress</span>
                                  <span className="font-bold text-[#003087]">₱{Number(program.amount_raised).toLocaleString()} / ₱{Number(program.funding_goal).toLocaleString()}</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#003087] rounded-full"
                                    style={{ width: `${program.progress_percentage || 0}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Beneficiary: {program.beneficiary}</span>
                                <span>Donors: {program.donor_count}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditProgram(program)}
                                  className="px-3 py-2 text-sm font-bold text-[#003087] bg-blue-50 rounded-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleArchiveProgram(program.id)}
                                  className="px-3 py-2 text-sm font-bold text-yellow-700 bg-yellow-50 rounded-lg"
                                >
                                  Archive
                                </button>
                                <button
                                  onClick={() => handleDeleteProgram(program.id)}
                                  className="px-3 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {programs.filter((program) => program.is_archived).length > 0 && (
                        <div className="grid grid-cols-1 gap-6 pt-4">
                          <div className="text-sm font-bold text-gray-700">Archived Programs</div>
                          {programs.filter((program) => program.is_archived).map((program) => (
                            <div key={`archived-${program.id}`} className="p-6 border border-gray-200 rounded-3xl space-y-4 bg-gray-50">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xl font-bold text-gray-900">{program.title}</h4>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">Archived</span>
                              </div>
                              <p className="text-sm text-gray-500">{program.description}</p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500 font-medium">Progress</span>
                                  <span className="font-bold text-[#003087]">₱{Number(program.amount_raised).toLocaleString()} / ₱{Number(program.funding_goal).toLocaleString()}</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#003087] rounded-full"
                                    style={{ width: `${program.progress_percentage || 0}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Beneficiary: {program.beneficiary}</span>
                                <span>Donors: {program.donor_count}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRestoreProgram(program.id)}
                                  className="px-3 py-2 text-sm font-bold text-[#003087] bg-blue-50 rounded-lg"
                                >
                                  Restore
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : managementView ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Manage Recurring Gifts</h1>
                    <p className="text-gray-500">Update your giving preferences or payment methods.</p>
                  </div>

                  <div className="space-y-4">
                    {activeGifts.map((gift) => (
                      <div key={gift.id} className="p-6 border border-blue-100 rounded-3xl bg-blue-50/30 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-[#003087] uppercase tracking-wider">{gift.freq} Gift</p>
                            <h4 className="text-2xl font-bold text-gray-900">{gift.amount}</h4>
                          </div>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500" /> Next Billing: {gift.nextDate}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Gift className="w-4 h-4 text-blue-500" /> Fund: {gift.designation}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button 
                            onClick={() => setIsEditingAmount(true)}
                            className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                          >
                            Update Amount
                          </button>
                          <button 
                            onClick={() => window.confirm("Are you sure you want to cancel this recurring gift?")}
                            className="px-4 py-3 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
                    <div className="flex items-center gap-4 text-gray-500">
                      <CreditCard className="w-6 h-6" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Default Payment Method</p>
                        <p className="text-xs">{selectedPayment === 'Credit Card' ? 'Visa ending in 4242' : selectedPayment}</p>
                      </div>
                      <button 
                        onClick={() => setIsChangingPayment(true)}
                        className="text-[#003087] text-xs font-bold underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Make Your Gift</h1>
                    <p className="text-gray-500">Thank you for supporting ADDU. Your generosity makes a lasting difference.</p>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900">Manage Your Giving</h4>
                      <p className="text-sm text-gray-500">Track and update your existing contributions</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => setManagementView(true)} className="px-6 py-2 bg-white border border-gray-300 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">Manage Gifts</button>
                      <button onClick={() => { if(window.confirm("Are you sure you want to cancel your recurring gift?")) { setSelectedFreq('One-Time'); } }} className="px-6 py-2 bg-white border border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all">Cancel</button>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">1</span>Select Your Gift Amount</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['₱50', '₱100', '₱200', '₱1,000'].map((amt) => (
                          <button key={amt} onClick={() => handleToggle(selectedAmount, amt, setSelectedAmount)} className={`py-4 rounded-2xl font-bold border-2 transition-all ${selectedAmount === amt ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'}`}>{amt}</button>
                        ))}
                      </div>
                      <input type="text" placeholder="Enter Amount" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">2</span>Choose Gift Frequency</h3>
                        {selectedFreq && selectedFreq !== 'One-Time' && (
                          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                            <Heart className="w-3 h-3 fill-current" /> Recurring Active
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {['One-Time', 'Monthly', 'Annual'].map((freq) => (
                          <button key={freq} onClick={() => handleToggle(selectedFreq, freq, setSelectedFreq)} className={`px-8 py-3 rounded-xl border-2 font-bold transition-all ${selectedFreq === freq ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{freq}</button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">3</span>Designate Your Gift</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {["Where it's needed most (Unrestricted)", "Student Financial Aid", "Faculty Excellence", "Research & Innovation", "Campus Infrastructure", "Academic Programs", "Global Engagement"].map((dest) => (
                          <button key={dest} onClick={() => handleToggle(selectedDesignation, dest, setSelectedDesignation)} className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all text-left ${selectedDesignation === dest ? 'bg-blue-50 border-[#003087] text-[#003087]' : 'bg-white border-gray-100 text-gray-600'}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedDesignation === dest ? 'border-[#003087] bg-[#003087]' : 'border-gray-300'}`}>{selectedDesignation === dest && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div>
                            <span className="text-sm font-bold">{dest}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">4</span>Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                        <input type="text" placeholder="Last Name *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                        <input type="email" placeholder="Email Address *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl md:col-span-2" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">5</span>Payment Details</h3>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          {['Credit Card', 'GCash', 'Bank Transfer'].map(m => (
                            <button key={m} onClick={() => setSelectedPayment(m)} className={`px-6 py-3 border-2 rounded-xl text-sm font-bold transition-all ${selectedPayment === m ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{m}</button>
                          ))}
                        </div>
                        <input type="text" placeholder="Card Number *" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="Expiry Date *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                          <input type="text" placeholder="CVV *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100 space-y-6">
                      <button className="w-full py-5 bg-[#003087] text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-[#002566] transition-all">
                        {selectedFreq === 'One-Time' || !selectedFreq ? 'Complete My Gift' : `Start My ${selectedFreq} Gift`}
                      </button>
                      <div className="grid grid-cols-3 gap-4 text-[11px] text-gray-400 font-bold uppercase text-center">
                        <div className="flex items-center justify-center gap-2"><Lock className="w-3 h-3" /> Secure</div>
                        <div>📧 Receipt via Email</div>
                        <div>💳 Tax-Deductible</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* HERO */}
        <div className="bg-[#003087] text-white py-24 px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Supporting Excellence at ADDU</h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">Your generosity empowers students, advances research, and strengthens our Jesuit mission of service and excellence.</p>
            <div className="pt-4 flex flex-col items-center gap-4">
              {userRole === "admin" ? (
                <button 
                  onClick={() => {
                    setShowForm(true);
                    setAdminManagementView(true);
                  }} 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-black/20"
                >
                  <Settings className="w-4 h-4 inline mr-2" /> Manage Campaigns
                </button>
              ) : (
                <button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-black/20">Make a Gift Today</button>
              )}
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="max-w-7xl mx-auto px-8 mt-16 border-b border-gray-200">
          <div className="flex gap-12">
            <button 
              onClick={() => setActiveTab('gift')}
              className={`pb-4 text-base font-bold transition-all border-b-4 ${activeTab === 'gift' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Make a Gift
            </button>
            <button 
              onClick={() => setActiveTab('needs')}
              className={`pb-4 text-base font-bold transition-all border-b-4 ${activeTab === 'needs' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Areas of Greatest Need
            </button>
          </div>
        </div>

        {activeTab === 'gift' && (
          <>
            <div className="max-w-7xl mx-auto px-8 py-20">
              <div className="flex flex-col sm:flex-row justify-center gap-8">
                {[["Active Donors", "4,250"], ["Alumni Participation", "35%"]].map(([label, val], i) => (
                  <div key={i} className="flex-1 max-w-sm space-y-2 border-2 border-blue-500 p-10 rounded-[32px] shadow-lg shadow-blue-100/50 hover:shadow-xl transition-all bg-white text-center">
                    <p className="text-5xl font-extrabold text-[#003087]">{val}</p>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#003087] py-24 px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-7 space-y-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-orange-400 font-bold uppercase tracking-widest text-sm">
                        <Award className="w-5 h-5" /> Recognition Tiers
                      </div>
                      <h2 className="text-4xl font-bold text-white">Honoring Our Donors</h2>
                      <p className="text-blue-200 text-lg">We honor our generous supporters who make our mission possible.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: "Founder's Circle", price: "₱1,000,000+", perks: ["Named endowment opportunities", "Private events with leadership", "Campus naming rights", "Lifetime recognition on Founder's Wall"] },
                        { name: "President's Council", price: "₱500,000 - ₱999,999", perks: ["Exclusive event invitations", "Annual donor report recognition", "Personal thank you from President", "Priority access"] },
                        { name: "Loyola Society", price: "₱100,000 - ₱499,999", perks: ["Recognition event invitations", "Name in publications", "Donor appreciation events", "Semi-annual impact reports"] },
                        { name: "Blue & Gold Circle", price: "₱25,000 - ₱99,999", perks: ["Donor honor roll", "Annual impact summary", "University invitations", "Official tax receipt"] }
                      ].map((tier, i) => (
                        <div key={i} className="bg-white/5 p-8 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all">
                          <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                          <p className="text-orange-400 font-bold mb-6 text-sm">{tier.price}</p>
                          <ul className="space-y-3">
                            {tier.perks.map((p, pi) => (
                              <li key={pi} className="text-[11px] text-blue-100 flex items-start gap-2 leading-relaxed">
                                <CheckCircle2 className="w-3 h-3 text-orange-500 mt-0.5 shrink-0" /> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="bg-white rounded-[40px] p-10 h-full shadow-2xl">
                      <div className="flex items-center gap-3 text-[#003087] font-bold uppercase tracking-widest text-sm mb-4"><Gift className="w-5 h-5" /> Giving Methods</div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-8">Ways to Give</h3>
                      <div className="space-y-10">
                        {[{ t: "Cash Gifts", d: "Immediate impact via credit card, GCash, or bank transfer." }, { t: "Planned Giving", d: "Create a legacy through bequests or trusts." }].map((way, i) => (
                          <div key={i} className="group">
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#003087] transition-colors">{way.t}</h4>
                            <p className="text-gray-500 text-sm mb-3 leading-relaxed">{way.d}</p>
                            <button onClick={() => setShowForm(true)} className="text-[#003087] text-sm font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Give Now <ArrowRight className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'needs' && (
          <>
            {/* ACTIVE CAMPAIGNS SECTION */}
            <div className="max-w-7xl mx-auto px-8 py-24">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Active Fundraising Campaigns</h2>
                  <p className="text-gray-500 text-lg">Support our ongoing initiatives and make a direct impact</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 font-semibold text-lg">Loading campaigns...</p>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 font-semibold text-lg">No active campaigns at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="bg-white p-8 rounded-[24px] border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-900 flex-1">{campaign.title}</h3>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
                        </div>

                        <p className="text-gray-600 text-sm mb-6 flex-1">Support this important initiative</p>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600 font-medium">Progress</span>
                              <span className="text-sm font-bold text-[#003087]">{campaign.raised} / {campaign.goal}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#003087] rounded-full transition-all"
                                style={{ width: `${Math.min(100, (parseInt(campaign.raised.replace(/\D/g, '')) || 0) / (parseInt(campaign.goal.replace(/\D/g, '')) || 1) * 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-medium">👥 {campaign.backers} supporters</span>
                          </div>

                          <button
                            onClick={() => openDonationModal(campaign)}
                            className="w-full py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-all"
                          >
                            Donate Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AREAS OF GREATEST NEED */}
            <div className="bg-gray-50/50 py-16">
              <div className="max-w-7xl mx-auto px-8 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-16">Areas of Greatest Need</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {[
                  { title: "Student Financial Aid", desc: "Ensure every deserving student can access education.", stats: ["₱12.5M annually", "450+ scholars"], icon: <GraduationCap /> },
                  { title: "Faculty Excellence", desc: "Attract and retain world-class educators.", stats: ["₱8M development", "180+ faculty"], icon: <Presentation /> },
                  { title: "Research & Innovation", desc: "Advance breakthrough research.", stats: ["₱6.2M grants", "45 projects"], icon: <Microscope /> },
                  { title: "Campus Infrastructure", desc: "Build state-of-the-art facilities.", stats: ["₱28M improvements", "5 facilities"], icon: <Building2 /> },
                  { title: "Academic Programs", desc: "Prepare students for tomorrow.", stats: ["₱4.8M support", "12 programs"], icon: <BookOpen /> },
                  { title: "Global Engagement", desc: "Expand international partnerships.", stats: ["₱3.5M exchanges", "85 experiences"], icon: <Globe /> }
                ].map((area, i) => (
                  <div key={i} className="bg-white p-10 rounded-[32px] border border-gray-100 flex flex-col shadow-sm">
                    <div className="bg-blue-50 text-[#003087] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">{area.icon}</div>
                    <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                    <p className="text-gray-500 mb-8 flex-1 leading-relaxed">{area.desc}</p>
                    <div className="space-y-3 mb-10 pt-6 border-t border-gray-100">
                      {area.stats.map((s, si) => (
                        <div key={si} className="text-sm font-bold text-gray-700 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" />{s}</div>
                      ))}
                    </div>
                    <button onClick={() => setShowForm(true)} className="w-full py-4 rounded-xl border-2 border-[#003087] text-[#003087] font-bold text-sm hover:bg-[#003087] hover:text-white transition-all">Support This Area</button>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </>
        )}

        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="relative overflow-hidden flex flex-col gap-12 rounded-[48px] p-12 md:p-20 shadow-2xl bg-[#003087]">
            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Make an Impact?</h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">Your gift today will transform lives for generations to come.</p>
              <div className="pt-4">
                <button onClick={() => setShowForm(true)} className="bg-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:bg-orange-500 transition-all transform hover:-translate-y-1">Give Now</button>
              </div>
            </div>
            <div className="relative z-10 pt-12 border-t border-white/10 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Questions?</h3>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a href="mailto:development@addu.edu.ph" className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-white/10 text-white font-bold hover:bg-white hover:text-[#003087] transition-all"><Mail className="w-5 h-5" /> development@addu.edu.ph</a>
                <a href="tel:+63822212411" className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-white/10 text-white font-bold hover:bg-white hover:text-[#003087] transition-all"><Phone className="w-5 h-5" /> +63 (82) 221-2411</a>
              </div>
            </div>
          </div>
        </div>

        {/* DONATION MODAL */}
        {showDonationModal && selectedCampaignForDonation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Donate to {selectedCampaignForDonation.title}</h2>
                <button
                  onClick={() => setShowDonationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Campaign Info */}
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="font-bold text-[#003087]">{selectedCampaignForDonation.raised} / {selectedCampaignForDonation.goal}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#003087] rounded-full"
                      style={{ width: `${Math.min(100, (parseInt(selectedCampaignForDonation.raised.replace(/\D/g, '')) || 0) / (parseInt(selectedCampaignForDonation.goal.replace(/\D/g, '')) || 1) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{selectedCampaignForDonation.backers} supporters already donated</p>
                </div>

                {/* Donation Amount */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Donation Amount (₱) *</label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">First Name *</label>
                  <input
                    type="text"
                    value={donationFirstName}
                    onChange={(e) => setDonationFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    value={donationLastName}
                    onChange={(e) => setDonationLastName(e.target.value)}
                    placeholder="Your last name"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    value={donationEmail}
                    onChange={(e) => setDonationEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#003087] transition-all"
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Credit Card', 'GCash', 'Bank Transfer'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setDonationPaymentMethod(method)}
                        className={`p-3 border-2 rounded-xl font-bold text-sm transition-all ${
                          donationPaymentMethod === method
                            ? 'bg-[#003087] border-[#003087] text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087]'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => setShowDonationModal(false)}
                    className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                    disabled={isDonating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDonateToCampaign}
                    disabled={isDonating}
                    className="flex-1 py-4 bg-[#003087] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#002566] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDonating ? 'Processing...' : `Donate ₱${donationAmount || '0'}`}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Your donation is secure and tax-deductible. You will receive a receipt via email.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}