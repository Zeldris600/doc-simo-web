import * as React from "react";
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import type { SVGProps } from "react";

import {
  AlertCircleIcon,
  Alert01Icon,
  ArrowDownRight01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpRight01Icon,
  ArrowUpDownIcon,
  Award01Icon,
  AddCircleIcon,
  BookOpen01Icon,
  PieChartIcon,
  ChartLineData01Icon,
  TerminalIcon,
  FrameworksIcon,
  GalleryHorizontalEndIcon,
  PercentCircleIcon,
  CircleIcon,
  Settings04Icon,
  Store01Icon,
  ChartUpIcon,
  HeadphonesIcon,
  Home01Icon,
  GridIcon,
  Image01Icon,
  ListViewIcon,
  BellDotIcon,
  Facebook01Icon,
  FavouriteIcon,
  File01Icon,
  Folder01Icon,
  Forward01Icon,
  EyeIcon,
  FlameKindlingIcon,
  InformationCircleIcon,
  InstagramIcon,
  Key01Icon,
  LabsIcon,
  Leaf01Icon,
  LifebuoyIcon,
  Link01Icon,
  Logout01Icon,
  LoaderPinwheelIcon,
  Mail01Icon,
  MapPinIcon,
  Mic01Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  Package01Icon,
  PackageAdd01Icon,
  PackageDeliveredIcon,
  PencilIcon,
  PanelLeftIcon,
  ClipIcon,
  PlayIcon,
  Pulse01Icon,
  Plant01Icon,
  PlusSignIcon,
  QuoteUpIcon,
  RefreshIcon,
  Search01Icon,
  Settings01Icon,
  Shield01Icon,
  ShieldPlusIcon,
  SentIcon,
  ShoppingBag01Icon,
  ShoppingBagAddIcon,
  ShoppingCart01Icon,
  SmartphoneWifiIcon,
  SparklesIcon,
  SquareIcon,
  StarIcon,
  Stethoscope02Icon,
  Tag01Icon,
  TestTube01Icon,
  Ticket01Icon,
  TimeQuarterPassIcon,
  Delete01Icon,
  TruckIcon,
  Upload01Icon,
  UserGroupIcon,
  UserCircleIcon,
  Video01Icon,
  VolumeHighIcon,
  YoutubeIcon,
  SaveIcon,
  ZapIcon,
  Camera01Icon,
  MessageCircleReplyIcon,
  CreditCardIcon,
  Calendar01Icon,
  LockIcon,
  CheckmarkCircle01Icon,
  CheckmarkBadge01Icon,
  CheckmarkSquare01Icon,
  Copy01Icon,
  Cancel01Icon,
  Menu01Icon,
  Message01Icon,
  DashboardSquare01Icon,
  Call02Icon,
  Globe02Icon,
  // HugeIcons doesn't expose "chevrons" like lucide; use arrows.
} from "@hugeicons/core-free-icons";

type BaseProps = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
};

function createIcon(icon: HugeiconsIconProps["icon"]) {
  const Comp = React.forwardRef<SVGSVGElement, BaseProps>(
    (
      { size = 20, color = "currentColor", strokeWidth = 1.8, ...rest },
      ref,
    ) => (
      <HugeiconsIcon
        ref={ref}
        icon={icon}
        size={size}
        primaryColor={color}
        strokeWidth={strokeWidth}
        {...rest}
      />
    ),
  );
  Comp.displayName = "HugeIcon";
  return Comp;
}

// Storefront / header icons
export const User = createIcon(UserCircleIcon);
export const LogOut = createIcon(Logout01Icon);
export const Facebook = createIcon(Facebook01Icon);
export const Instagram = createIcon(InstagramIcon);
export const ShoppingBag = createIcon(ShoppingBag01Icon);
export const LayoutDashboard = createIcon(DashboardSquare01Icon);
export const Home = createIcon(Home01Icon);
export const Menu = createIcon(Menu01Icon);
export const MessageSquare = createIcon(Message01Icon);
export const PanelLeft = createIcon(PanelLeftIcon);
export const BadgeCheck = createIcon(CheckmarkBadge01Icon);
export const ChevronsUpDown = createIcon(ArrowUpDownIcon);
export const Circle = createIcon(CircleIcon);

// Common action icons used in CTAs (per your reference)
export const ArrowRight = createIcon(ArrowRight01Icon);
export const Phone = createIcon(Call02Icon);
export const Globe = createIcon(Globe02Icon);
export const ChevronDown = createIcon(ArrowDown01Icon);
export const ChevronUp = createIcon(ArrowUp01Icon);

// Lucide-compatible names used across the app
export const Search = createIcon(Search01Icon);
export const ChevronLeft = createIcon(ArrowLeft01Icon);
export const ChevronRight = createIcon(ArrowRight01Icon);
export const ArrowLeft = createIcon(ArrowLeft01Icon);
export const ArrowUpRight = createIcon(ArrowUpRight01Icon);
export const ArrowDownRight = createIcon(ArrowDownRight01Icon);
export const MoreHorizontal = createIcon(MoreHorizontalIcon);
export const Calendar = createIcon(Calendar01Icon);
export const Clock = createIcon(TimeQuarterPassIcon);
export const MapPin = createIcon(MapPinIcon);
export const Truck = createIcon(TruckIcon);
export const Lock = createIcon(LockIcon);
export const ShieldCheck = createIcon(Shield01Icon);
export const Shield = createIcon(Shield01Icon);
export const ShieldPlus = createIcon(ShieldPlusIcon);
export const AlertTriangle = createIcon(Alert01Icon);
export const AlertCircle = createIcon(AlertCircleIcon);
export const Loader2 = createIcon(LoaderPinwheelIcon);
export const X = createIcon(Cancel01Icon);
export const Copy = createIcon(Copy01Icon);
export const Check = createIcon(CheckmarkSquare01Icon);
export const CheckCircle2 = createIcon(CheckmarkCircle01Icon);
export const Tag = createIcon(Tag01Icon);
export const Star = createIcon(StarIcon);
export const Heart = createIcon(FavouriteIcon);
export const Flame = createIcon(FlameKindlingIcon);
export const Zap = createIcon(ZapIcon);
export const Play = createIcon(PlayIcon);
export const Eye = createIcon(EyeIcon);
export const EyeOff = createIcon(EyeIcon);
export const Quote = createIcon(QuoteUpIcon);
export const Leaf = createIcon(Leaf01Icon);
export const Sprout = createIcon(Plant01Icon);
export const FlaskConical = createIcon(TestTube01Icon);
export const TestTube = createIcon(TestTube01Icon);
export const Beaker = createIcon(LabsIcon);
export const Users = createIcon(UserGroupIcon);
export const Stethoscope = createIcon(Stethoscope02Icon);
export const Award = createIcon(Award01Icon);
export const GraduationCap = createIcon(Award01Icon);
export const PhoneCall = createIcon(Call02Icon);
export const Package = createIcon(Package01Icon);
export const PackagePlus = createIcon(PackageAdd01Icon);
export const PackageCheck = createIcon(PackageDeliveredIcon);
export const Plus = createIcon(PlusSignIcon);
export const Minus = createIcon(MinusSignIcon);
export const Trash2 = createIcon(Delete01Icon);
export const Pencil = createIcon(PencilIcon);
export const RotateCcw = createIcon(RefreshIcon);
export const Paperclip = createIcon(ClipIcon);
export const Mic = createIcon(Mic01Icon);
export const Square = createIcon(SquareIcon);
export const Volume2 = createIcon(VolumeHighIcon);
export const HeartPulse = createIcon(Pulse01Icon);
export const Sparkles = createIcon(SparklesIcon);
export const Info = createIcon(InformationCircleIcon);
export const Mail = createIcon(Mail01Icon);
export const Key = createIcon(Key01Icon);
export const Send = createIcon(SentIcon);
export const Share2 = createIcon(Link01Icon);
export const ExternalLink = createIcon(Link01Icon);
export const Youtube = createIcon(YoutubeIcon);
export const MessageCircle = createIcon(MessageCircleReplyIcon);
export const ShoppingCart = createIcon(ShoppingCart01Icon);
export const Camera = createIcon(Camera01Icon);
export const Upload = createIcon(Upload01Icon);
export const ImageIcon = createIcon(Image01Icon);
export const Save = createIcon(SaveIcon);
export const Settings = createIcon(Settings01Icon);
export const Settings2 = createIcon(Settings01Icon);
export const Smartphone = createIcon(SmartphoneWifiIcon);
export const CreditCard = createIcon(CreditCardIcon);
export const Ticket = createIcon(Ticket01Icon);
export const LifeBuoy = createIcon(LifebuoyIcon);
export const FileText = createIcon(File01Icon);
export const FolderTree = createIcon(Folder01Icon);
export const Folder = createIcon(Folder01Icon);
export const Forward = createIcon(Forward01Icon);
export const Warehouse = createIcon(Store01Icon);
export const Percent = createIcon(PercentCircleIcon);
export const TrendingUp = createIcon(ChartUpIcon);
export const Bell = createIcon(BellDotIcon);
export const Headphones = createIcon(HeadphonesIcon);
export const SlidersHorizontal = createIcon(Settings04Icon);
export const LayoutGrid = createIcon(GridIcon);
export const List = createIcon(ListViewIcon);
export const ShoppingBagAdd = createIcon(ShoppingBagAddIcon);

// Admin sidebar mappings
export const BookOpen = createIcon(BookOpen01Icon);
export const PieChart = createIcon(PieChartIcon);
export const LineChart = createIcon(ChartLineData01Icon);
export const SquareTerminal = createIcon(TerminalIcon);
export const PlusCircle = createIcon(AddCircleIcon);
export const Frame = createIcon(FrameworksIcon);
export const GalleryVerticalEnd = createIcon(GalleryHorizontalEndIcon);

export type IconType = React.ComponentType<BaseProps>;
