import type { ReactNode } from 'react';
import { DyeingPage } from '../calculators/dyeing/DyeingPage';
import { FabricConsumptionPage } from '../calculators/fabric/FabricConsumptionPage';
import { GsmCalculator } from '../calculators/fabric/GsmCalculator';
import { CapacityPage } from '../calculators/production/CapacityPage';
import { EfficiencyCalculator } from '../calculators/production/EfficiencyCalculator';
import { OeeCalculator } from '../calculators/production/OeeCalculator';
import { QualityPage } from '../calculators/quality/QualityPage';

/**
 * Single source of truth for navigation. Only implemented calculators are
 * listed here; nothing is shown as available unless it works.
 */
export interface ToolEntry {
  title: string;
  description: string;
  path: string;
  element: ReactNode;
}

export interface Category {
  title: string;
  description: string;
  path: string;
  tools: readonly ToolEntry[];
}

export const CATEGORIES: readonly Category[] = [
  {
    title: 'Fabric Calculators',
    description: 'Fabric mass per area, marker-based consumption and marker efficiency.',
    path: '/fabric',
    tools: [
      {
        title: 'Fabric GSM Calculator',
        description:
          'Calculate fabric mass per unit area (g/m²) from a sample’s mass and dimensions.',
        path: '/fabric/gsm',
        element: <GsmCalculator />,
      },
      {
        title: 'Fabric Consumption and Marker Efficiency',
        description:
          'Estimate fabric length per garment from a marker and calculate marker efficiency.',
        path: '/fabric/consumption',
        element: <FabricConsumptionPage />,
      },
    ],
  },
  {
    title: 'Dyeing Calculators',
    description: 'Liquor quantity from a liquor ratio and chemical quantity from a % owf.',
    path: '/dyeing',
    tools: [
      {
        title: 'Dyeing Liquor and Recipe Quantity',
        description:
          'Calculate liquor mass and approximate volume, and chemical mass from a percentage on weight of fabric.',
        path: '/dyeing/liquor-recipe',
        element: <DyeingPage />,
      },
    ],
  },
  {
    title: 'Production Calculators',
    description: 'Theoretical capacity and production efficiency.',
    path: '/production',
    tools: [
      {
        title: 'Production Capacity',
        description:
          'Estimate theoretical output from a production rate, or from a cycle time and operating time.',
        path: '/production/capacity',
        element: <CapacityPage />,
      },
      {
        title: 'Production Efficiency',
        description: 'Calculate actual production as a percentage of expected production.',
        path: '/production/efficiency',
        element: <EfficiencyCalculator />,
      },
    ],
  },
  {
    title: 'OEE Calculator',
    description: 'Availability, Performance, Quality and Overall Equipment Effectiveness.',
    path: '/oee',
    tools: [
      {
        title: 'OEE Calculator',
        description:
          'Calculate Availability, Performance, Quality and OEE from time and production counts.',
        path: '/oee',
        element: <OeeCalculator />,
      },
    ],
  },
  {
    title: 'Quality Calculators',
    description: 'Defect percentage, measurement average, minimum, maximum and range.',
    path: '/quality',
    tools: [
      {
        title: 'Basic Quality Calculations',
        description:
          'Calculate defect percentage, the average of measurements, and their minimum, maximum and range.',
        path: '/quality/basic',
        element: <QualityPage />,
      },
    ],
  },
];

export const HOME_PATH = '/';
export const ABOUT_PATH = '/about';

export interface NavItem {
  label: string;
  path: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', path: HOME_PATH },
  ...CATEGORIES.map((category) => ({ label: category.title, path: category.path })),
  { label: 'About and Limitations', path: ABOUT_PATH },
];

/** True when `path` is the item's own page or a page below it. */
export function isActive(itemPath: string, currentPath: string): boolean {
  if (itemPath === HOME_PATH) {
    return currentPath === HOME_PATH;
  }
  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

export function findCategory(path: string): Category | undefined {
  return CATEGORIES.find((category) => category.path === path);
}

export function findTool(path: string): { category: Category; tool: ToolEntry } | undefined {
  for (const category of CATEGORIES) {
    const tool = category.tools.find((candidate) => candidate.path === path);
    if (tool) {
      return { category, tool };
    }
  }
  return undefined;
}

export function toHref(path: string): string {
  return `#${path}`;
}
