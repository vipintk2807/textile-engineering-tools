import { AppLayout } from '../components/AppLayout';
import {
  ABOUT_PATH,
  findCategory,
  findTool,
  HOME_PATH,
} from './navigation';
import { AboutPage, CategoryPage, HomePage, NotFoundPage, ToolPage } from './pages';
import { useHashPath } from './useHashPath';

export function App() {
  const path = useHashPath();

  let title = 'Page not found';
  let page = <NotFoundPage />;

  const toolMatch = findTool(path);
  const category = findCategory(path);

  if (path === HOME_PATH) {
    title = 'Home';
    page = <HomePage />;
  } else if (path === ABOUT_PATH) {
    title = 'About and Limitations';
    page = <AboutPage />;
  } else if (toolMatch) {
    // The OEE category and its only tool share a path; show the tool directly.
    title = toolMatch.tool.title;
    page = <ToolPage category={toolMatch.category} tool={toolMatch.tool} />;
  } else if (category) {
    title = category.title;
    page = <CategoryPage category={category} />;
  }

  return (
    <AppLayout currentPath={path} pageTitle={title}>
      {page}
    </AppLayout>
  );
}
