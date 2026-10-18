import { Switch, cn } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

//Icons
import Icons from "@/iconsSvg";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Switch
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        color="default"
        thumbIcon={({ isSelected }) =>
          isSelected ? (
            <p className="text-sm text-slate-700">{Icons.ArrowPathcon}</p>
          ) : (
            <p className="text-sm text-warning-500">
              {Icons.ArrowUturnDownIcon}
            </p>
          )
        }
        classNames={{
          base: cn(
            "items-center",
            "justify-between cursor-pointer rounded-lg gap-2 p-4"
          ),
          wrapper: "p-0 h-7 w-14 overflow-visible ",
          thumb: cn("w-9 h-8"),
        }}
      ></Switch>
    </div>
  );
}

export default ThemeSwitcher;
