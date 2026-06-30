'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Close, Layers } from '@mui/icons-material';
import gsap from 'gsap';

const mapControlShellClass =
  'inline-flex flex-col gap-2 rounded-xl border border-white/15 bg-slate-950/75 p-3 font-bold text-white ' +
  'backdrop-blur-md transition-all duration-300 ease-smooth w-max max-w-[min(18rem,calc(100vw-2rem))] ' +
  'hover:border-white/25';

export const mapButtonClass = `${mapControlShellClass} cursor-pointer`;

export const mapIconButtonSx = {
  p: 0,
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
};

const panelClass = mapControlShellClass;

const layerRowClass =
  'climate-layer-row rounded-lg py-0.5 pl-0 pr-1 transition-colors hover:bg-white/5';

const checkboxClass = '!text-sky-400 !py-1 !pl-0 !pr-1';

const closeIconSx = {
  color: 'rgba(255,255,255,0.9)',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
};

const formGroupSx = { m: 0, p: 0 };

const labelSx = {
  mx: 0,
  pl: 0,
  width: 'fit-content',
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.92)',
  },
};

const LAYER_ROWS = [
  { key: 'pressure', label: 'Air Pressure' },
  { key: 'clouds', label: 'Clouds' },
  { key: 'precip', label: 'Precipitation' },
  { key: 'temp', label: 'Temperature' },
  { key: 'wind', label: 'Wind' },
];

export const DEFAULT_CLIMATE_LAYERS = Object.fromEntries(
  LAYER_ROWS.map(({ key }) => [key, true])
);

const ClimateLayers = ({ layers, setLayers }) => {
  const [open, setOpen] = useState(false);
  const openPanelRef = useRef(null);

  const handleChange = (layer, value) => {
    setLayers((prev) => ({ ...prev, [layer]: value }));
  };

  useLayoutEffect(() => {
    const panel = openPanelRef.current;
    if (!open || !panel) return;
    const rows = panel.querySelectorAll('.climate-layer-row');
    const ctx = gsap.context(() => {
      gsap.from(rows, {
        opacity: 0,
        x: -10,
        stagger: 0.04,
        duration: 0.34,
        ease: 'power2.out',
      });
    }, panel);
    return () => ctx.revert();
  }, [open]);

  if (!open) {
    return (
      <Tooltip title="Layers" placement="bottom" arrow>
        <div
          className={mapButtonClass}
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            sx={mapIconButtonSx}
          >
            <Layers className="!text-2xl text-white" />
          </IconButton>
        </div>
      </Tooltip>
    );
  }

  return (
    <div ref={openPanelRef} className={`${panelClass} gap-1`}>
      <div className="climate-layer-row mb-1 flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <span className="text-sm font-bold tracking-wide text-white/95">Layers</span>
        <IconButton
          aria-label="Close climate layers"
          size="small"
          onClick={() => setOpen(false)}
          sx={closeIconSx}
        >
          <Close className="!text-xl" />
        </IconButton>
      </div>

      <FormGroup className="w-fit gap-0.5" sx={formGroupSx}>
        {LAYER_ROWS.map(({ key, label }) => (
          <div key={key} className={layerRowClass}>
            <FormControlLabel
              sx={labelSx}
              control={
                <Checkbox
                  size="small"
                  className={checkboxClass}
                  checked={layers[key]}
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
              }
              label={label}
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
};

export default ClimateLayers;
