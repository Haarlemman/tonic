<div class="text-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-8">
  <p class="text-gray-700 text-lg">
    Each life event created specific biological and psychological changes. Click on each to explore.
  </p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

  <div class="event-card bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6 cursor-pointer transition-all shadow-lg" onclick="toggleEvent('adoption')">
    <div class="flex items-center gap-4 mb-4">
      <i class="fas fa-baby text-purple-600 text-3xl"></i>
      <div>
        <h3 class="text-xl font-bold text-gray-800">Adoption</h3>
        <span class="text-sm font-medium text-gray-600">Early Life</span>
      </div>
    </div>
    <div id="adoption-details" class="mt-4 space-y-4 hidden">
      <div>
        <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2"><i class="fas fa-brain text-purple-500"></i> Psychological Mechanisms:</h4>
        <ul class="space-y-2 pl-4 list-disc text-gray-700">
          <li>Primal wound theory: pre-verbal separation trauma</li>
          <li>Attachment disruption in critical developmental window</li>
          <li>Epigenetic changes from early stress</li>
          <li>Identity formation challenges</li>
          <li>Loss and grief (even when adoption is positive)</li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2"><i class="fas fa-dna text-blue-500"></i> Biological Impact:</h4>
        <ul class="space-y-2 pl-4 list-disc text-gray-700">
          <li>HPA axis dysregulation from infancy</li>
          <li>Altered cortisol patterns</li>
          <li>Changed stress response baseline</li>
          <li>Possible impact on dopamine systems (relevant to Parkinson's)</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="event-card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 cursor-pointer transition-all shadow-lg" onclick="toggleEvent('holocaust')">
    <div class="flex items-center gap-4 mb-4">
      <i class="fas fa-star-of-david text-blue-600 text-3xl"></i>
      <div>
        <h3 class="text-xl font-bold text-gray-800">Jewish / Holocaust Background</h3>
        <span class="text-sm font-medium text-gray-600">Intergenerational</span>
      </div>
    </div>
    <div id="holocaust-details" class="mt-4 space-y-4 hidden">
      <div>
        <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2"><i class="fas fa-brain text-purple-500"></i> Psychological Mechanisms:</h4>
        <ul class="space-y-2 pl-4 list-disc text-gray-700">
          <li>Transgenerational trauma transmission</li>
          <li>Epigenetic inheritance of stress responses</li>
          <li>Family narrative of survival and threat</li>
          <li>Cultural/collective trauma memory</li>
          <li>Possible hypervigilance as inherited trait</li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2"><i class="fas fa-dna text-blue-500"></i> Biological Impact:</h4>
        <ul class="space-y-2 pl-4 list-disc text-gray-700">
          <li>Inherited cortisol regulation patterns</li>
          <li>Altered glucocorticoid receptor sensitivity</li>
          <li>Documented in Holocaust survivor descendants</li>
          <li>Heightened threat detection systems</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="event-card bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-6 cursor-pointer transition-all shadow-lg" onclick="toggleEvent('london')">
    <div class="flex items-center gap-4 mb-4">
      <i class="fas fa-bomb text-red-600 text-3xl"></i>
      <div>
        <h3 class="text-xl font-bold text-gray-800">7/7 London Attack Survival</h3>
        <span class="text-sm font-medium text-gray-600">Acute Trauma</span>
      </div>
    </div>
    <div id="london-details" class="mt-4 space-y-4 hidden">
      <div>
        <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2"><i class="fas fa-brain text-purple-500"></i> Psychological Mechanisms:</h4>
        <ul class="space-y-2 pl-4 list-disc text-gray-700">
          <li>Direct life-threat experience</li>
          <li>Acute stress response</li>
          <li>Survivor guilt potential</li>
          <li>Shattered assumptions about safety</li>
          <li>Possible PTSD pathways</li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2"><i class="fas fa-dna text-blue-500"></i> Biological Impact:</h4>
        <ul class="space-y-2 pl-4 list-disc text-gray-700">
          <li>Acute HPA axis activation</li>
          <li>Norepinephrine surge effects</li>
          <li>Amygdala sensitization</li>
          <li>Memory consolidation under extreme stress</li>
          <li>Inflammatory response from psychological shock</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="event-card bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl p-6 cursor-pointer transition-all shadow-lg" onclick="toggleEvent('parkinsons')">
    <div class="flex items-center gap-4 mb-4">
      <i class="fas fa-brain text-orange-600 text-3xl"></i>
      <div>
        <h3 class="text-xl font-bold text-gray-800">Parkinson's Disease</h3>
        <span class="text-sm font-medium text-gray-600">Neurological</span>
      </div>
    </div>
    <div id="parkinsons-details" class="mt-4 space-y-4 hidden">
      <div>
        <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2"><i class="fas fa-brain text-purple-500"></i> Psychological Mechanisms:</h4>
        <ul class="space-y-2 pl-4 list-disc text-gray-700">
          <li>Dopaminergic neuron loss in substantia nigra</li>
          <li>Possible stress-accelerated neurodegeneration</li>
          <li>Chronic inflammation contribution</li>
          <li>Loss of motor control and autonomy</li>
          <li>New layer of uncertainty and threat</li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2"><i class="fas fa-dna text-blue-500"></i> Biological Impact:</h4>
        <ul class="space-y-2 pl-4 list-disc text-gray-700">
          <li>Dopamine depletion</li>
          <li>Motor circuit dysfunction</li>
          <li>Sleep architecture disruption (REM behavior disorder)</li>
          <li>Autonomic nervous system dysregulation</li>
          <li>Chronic inflammatory state</li>
        </ul>
      </div>
    </div>
  </div>

</div>