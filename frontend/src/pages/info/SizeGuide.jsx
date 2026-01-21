import "./InfoPages.css";

export default function SizeGuide() {
  return (
    <div className="info-page">
      <div className="container">
        <div className="info-header">
          <h1>Size Guide</h1>
          <p>Find your perfect fit</p>
        </div>

        <div className="info-content">
          <div className="info-section">
            <h2>How to Measure</h2>
            <div className="measurement-guide">
              <div className="measurement-item">
                <div className="measurement-number">1</div>
                <div className="measurement-content">
                  <h3>Chest</h3>
                  <p>Measure around the fullest part of your chest, keeping the tape horizontal</p>
                </div>
              </div>
              <div className="measurement-item">
                <div className="measurement-number">2</div>
                <div className="measurement-content">
                  <h3>Waist</h3>
                  <p>Measure around your natural waistline, keeping the tape comfortably loose</p>
                </div>
              </div>
              <div className="measurement-item">
                <div className="measurement-number">3</div>
                <div className="measurement-content">
                  <h3>Length</h3>
                  <p>Measure from the highest point of shoulder to the hem</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>Men's Size Chart</h2>
            <div className="table-responsive">
              <table className="size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (inches)</th>
                    <th>Waist (inches)</th>
                    <th>Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>XS</strong></td>
                    <td>32-34</td>
                    <td>26-28</td>
                    <td>26-27</td>
                  </tr>
                  <tr>
                    <td><strong>S</strong></td>
                    <td>34-36</td>
                    <td>28-30</td>
                    <td>27-28</td>
                  </tr>
                  <tr>
                    <td><strong>M</strong></td>
                    <td>38-40</td>
                    <td>32-34</td>
                    <td>28-29</td>
                  </tr>
                  <tr>
                    <td><strong>L</strong></td>
                    <td>42-44</td>
                    <td>36-38</td>
                    <td>29-30</td>
                  </tr>
                  <tr>
                    <td><strong>XL</strong></td>
                    <td>46-48</td>
                    <td>40-42</td>
                    <td>30-31</td>
                  </tr>
                  <tr>
                    <td><strong>XXL</strong></td>
                    <td>50-52</td>
                    <td>44-46</td>
                    <td>31-32</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="info-section">
            <h2>Women's Size Chart</h2>
            <div className="table-responsive">
              <table className="size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (inches)</th>
                    <th>Waist (inches)</th>
                    <th>Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>XS</strong></td>
                    <td>30-32</td>
                    <td>24-26</td>
                    <td>24-25</td>
                  </tr>
                  <tr>
                    <td><strong>S</strong></td>
                    <td>32-34</td>
                    <td>26-28</td>
                    <td>25-26</td>
                  </tr>
                  <tr>
                    <td><strong>M</strong></td>
                    <td>36-38</td>
                    <td>30-32</td>
                    <td>26-27</td>
                  </tr>
                  <tr>
                    <td><strong>L</strong></td>
                    <td>40-42</td>
                    <td>34-36</td>
                    <td>27-28</td>
                  </tr>
                  <tr>
                    <td><strong>XL</strong></td>
                    <td>44-46</td>
                    <td>38-40</td>
                    <td>28-29</td>
                  </tr>
                  <tr>
                    <td><strong>XXL</strong></td>
                    <td>48-50</td>
                    <td>42-44</td>
                    <td>29-30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="info-section">
            <h2>Youth Size Chart</h2>
            <div className="table-responsive">
              <table className="size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Age</th>
                    <th>Chest (inches)</th>
                    <th>Height (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>YXS</strong></td>
                    <td>4-5</td>
                    <td>22-24</td>
                    <td>38-42</td>
                  </tr>
                  <tr>
                    <td><strong>YS</strong></td>
                    <td>6-8</td>
                    <td>24-26</td>
                    <td>43-50</td>
                  </tr>
                  <tr>
                    <td><strong>YM</strong></td>
                    <td>9-11</td>
                    <td>26-28</td>
                    <td>51-56</td>
                  </tr>
                  <tr>
                    <td><strong>YL</strong></td>
                    <td>12-14</td>
                    <td>28-30</td>
                    <td>57-62</td>
                  </tr>
                  <tr>
                    <td><strong>YXL</strong></td>
                    <td>15-16</td>
                    <td>30-32</td>
                    <td>63-66</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="info-section">
            <h2>Fit Guide</h2>
            <div className="fit-guide">
              <div className="fit-card">
                <h3>Regular Fit</h3>
                <p>Our standard fit jerseys are designed to be comfortable and not too tight. They follow the natural shape of your body with room to move.</p>
              </div>
              <div className="fit-card">
                <h3>Slim Fit</h3>
                <p>For a more tailored look, slim fit jerseys are cut closer to the body. Consider sizing up if you prefer a looser fit.</p>
              </div>
              <div className="fit-card">
                <h3>Relaxed Fit</h3>
                <p>Relaxed fit jerseys offer extra room and comfort. Perfect for layering or a casual, loose style.</p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <div className="size-tips">
              <h2>Sizing Tips</h2>
              <ul className="tips-list">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  If you're between sizes, we recommend sizing up
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  All measurements are approximate and may vary by ±1 inch
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  For the best fit, measure yourself with a flexible measuring tape
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Authentic jerseys may fit differently than replica versions
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Still unsure? Contact our customer service for personalized help
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
