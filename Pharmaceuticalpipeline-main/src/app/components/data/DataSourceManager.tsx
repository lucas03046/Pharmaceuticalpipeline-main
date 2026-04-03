import React, { useState } from 'react';
import { Play, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { DataSource } from '../../../types/database';
import { apiFetch } from '../../../lib/api';

interface DataSourceManagerProps {
  dataSource: DataSource;
}

interface ScrapeResult {
  created: number;
  updated: number;
  errors: string[];
  totalFetched?: number;
  success?: boolean;
}

export function DataSourceManager({ dataSource }: DataSourceManagerProps) {
  const [isScraping, setIsScraping] = useState(false);
  const [lastStats, setLastStats] = useState<ScrapeResult | null>(null);

  const handleRunScrape = async () => {
    if (dataSource.type !== 'clinical_trials_gov') {
      setLastStats({
        created: 0,
        updated: 0,
        errors: ['Local ingest is currently implemented for ClinicalTrials.gov only.'],
      });
      return;
    }

    setIsScraping(true);
    try {
      const result = await apiFetch<ScrapeResult>('/api/scrape/clinicaltrials?page_size=50&max_studies=100', {
        method: 'POST',
      });
      setLastStats(result);
    } catch (error) {
      setLastStats({
        created: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown scrape error'],
      });
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRunScrape}
          disabled={isScraping}
          className="flex items-center gap-2"
        >
          {isScraping ? <RefreshCw className="size-4 animate-spin" /> : <Play className="size-4" />}
          Run Local Ingest
        </Button>
      </div>

      {lastStats && (
        <div className={`p-3 rounded-md text-sm ${lastStats.errors.length > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <div className="flex items-center gap-2 font-medium">
            {lastStats.errors.length > 0 ? <AlertCircle className="size-4" /> : <RefreshCw className="size-4" />}
            Last Run Results:
          </div>
          <p className="mt-1">
            Fetched: {lastStats.totalFetched ?? 0} | Created: {lastStats.created} | Updated: {lastStats.updated} | Errors: {lastStats.errors.length}
          </p>
        </div>
      )}
    </div>
  );
}
